import { app } from "../../..";

const API_URL = app.server?.url.origin;

export const fetchRoute = <T extends unknown>({
  method,
  url,
  body,
}: {
  method: string;
  url: string;
  body?: T;
}) => {
  const URL = `${API_URL}${url}`;
  return app.fetch(
    new Request(URL, { method, ...(body && { body: JSON.stringify(body) }) }),
  );
};
