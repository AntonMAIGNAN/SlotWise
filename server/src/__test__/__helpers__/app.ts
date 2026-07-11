import { app } from "../../..";

const API_URL = app.server?.url.origin;

export const fetchRoute = <T extends unknown>({
  method,
  url,
  body,
  headers,
  ...rest
}: {
  method: string;
  url: string;
  body?: T;
} & Omit<RequestInit, "body">) => {
  return app.fetch(
    new Request(`${API_URL}${url}`, {
      method,
      ...rest,
      headers: {
        ...(body && { "Content-Type": "application/json" }),
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    }),
  );
};
