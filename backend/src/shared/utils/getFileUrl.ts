

export function getFileUrl(path?: string | null): string | null {
  if (!path) return null;

  return `${process.env.SERVER_BASE_URL}:${process.env.SERVER_PORT}${path}`;
}