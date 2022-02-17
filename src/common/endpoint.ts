export const getGetDocHttpEndpoint = (documentId: string) => {
  const url = new URL(`/docs/${documentId}/check`, import.meta.env.VITE_HTTP_ENDPOINT);
  return url.toString();
};

export const getViewDocWSEndpoint = (id: string): string => {
  const url = new URL(`/docs/${id}/view`, import.meta.env.VITE_WS_ENDPOINT);
  return url.toString();
};

export const getEditDocWSEndpoint = (id: string): string => {
  const url = new URL(`/docs/${id}/edit`, import.meta.env.VITE_WS_ENDPOINT);
  return url.toString();
};
