export class UpstreamError extends Error {
  service: string;
  status: number;
  correlationId?: string;
  requestId?: string;
  body?: unknown;

  constructor(data: {
    message: string;
    service: string;
    status: number;
    correlationId?: string;
    requestId?: string;
    body?: unknown;
  }) {
    super(data.message);
    this.service = data.service;
    this.status = data.status;
    this.correlationId = data.correlationId;
    this.requestId = data.requestId;
    this.body = data.body;
    this.name = "UpstreamError";
  }
}
