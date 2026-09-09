export const BACKEND_URL = (() => {
  const url = process.env.BACKEND_URL;
  if (!url)
    throw new Error("Missing required environment variable: BACKEND_URL");
  return url;
})();

export const DEFAULT_PAGE_SIZE = 12;
