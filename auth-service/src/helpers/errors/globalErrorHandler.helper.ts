import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { $ZodIssue } from "zod/v4/core/errors.cjs";
import { UpstreamError } from "./UpstreamError";
import { AppError } from "./AppError";

const formatIssues = (issues: $ZodIssue[]) =>
  issues.map((i) => ({
    path: i.path.map(String).join("."),
    message: i.message,
    code: i.code,
  }));

export const globalErrorHandler =
  (fastify: FastifyInstance) =>
  (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const status = error.statusCode || 500;

    const requestId = request.requestId;
    const correlationId = request.correlationId;

    const errorResponse: any = {
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal Server Error",
        status,
        requestId,
        correlationId,
      },
    };

    if (error instanceof AppError) {
      errorResponse.error.code = error.code;
      errorResponse.error.message = error.message;
      errorResponse.error.status = error.statusCode;
      if (error.details) errorResponse.error.details = error.details;
    } else if (error instanceof UpstreamError) {
      errorResponse.error.code = "UPSTREAM_ERROR";
      errorResponse.error.message = error.message;
      errorResponse.error.status = error.status || 502;
      errorResponse.error.details = {
        service: error.service,
        upstreamRequestId: error.requestId,
      };
    } else if (error instanceof ZodError) {
      errorResponse.error.code = "VALIDATION_ERROR";
      errorResponse.error.message = "Invalid request payload";
      errorResponse.error.status = 400;
      errorResponse.error.details = formatIssues(error.issues);
    }

    request.log.error({ error, requestId, correlationId }, "request_error");
    reply.status(errorResponse.error.status).send(errorResponse);
  };
