import axios, { AxiosInstance } from "axios";
import { retryClientCall } from "../helpers/client.helper";
import { env } from "../config";
import { FastifyInstance } from "fastify";
import { UpstreamError } from "../helpers/errors/UpstreamError";
import z from "zod";

export const CreateUserResp = z.object({ id: z.number().int().positive() });

export class UsersClient {
  private httpClient: AxiosInstance;
  private servieToken: string;

  constructor(fastify: FastifyInstance) {
    this.httpClient = axios.create({
      baseURL: env.USERS_SERVICE_BASE,
      timeout: 5000,
      validateStatus: () => true,
    });
    this.servieToken = fastify.signServiceToken();
  }

  async createUser({
    email,
    name,
    correlationId,
    requestId,
  }: {
    email: string;
    name: string;
    correlationId: string;
    requestId: string;
  }) {
    return retryClientCall(async () => {
      const response = await this.httpClient.post(
        "/users",
        { email, name },
        {
          headers: {
            Authorization: `Bearer ${this.servieToken}`,
            "x-correlation-id": correlationId,
            "x-request-id": requestId,
          },
        }
      );

      if (response.status < 200 || response.status >= 300) {
        throw new UpstreamError({
          message: `users-service responded with ${response.status}`,
          service: "users-service",
          status: response.status,
          correlationId: correlationId,
          requestId: response.headers["x-request-id"],
          body: response.data,
        });
      }

      const parsedResult = CreateUserResp.safeParse(response.data);
      if (!parsedResult.success) {
        throw new UpstreamError({
          message: "users-service returned invalid body",
          service: "users-service",
          status: response.status,
          correlationId: correlationId,
          requestId: response.headers["x-request-id"],
          body: response.data,
        });
      }

      return parsedResult.data;
    });
  }
}
