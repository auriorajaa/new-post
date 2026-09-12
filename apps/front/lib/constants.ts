function getBackendUrl(): string {
  const url = process.env.BACKEND_URL;
  if (!url) {
    throw new Error("Missing required environment variable: BACKEND_URL");
  }
  return url;
}

export const BACKEND_URL = getBackendUrl;

export const DEFAULT_PAGE_SIZE = 12;
