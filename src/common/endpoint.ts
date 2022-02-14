export const calcViewDocumentEndpoint = (id: string): string => {
  const url = new URL(`/docs/${id}/view`, import.meta.env.VITE_WS_ENDPOINT);
  return url.toString();
};

export const calcEditDocumentEndpoint = (id: string): string => {
  const url = new URL(`/docs/${id}/edit`, import.meta.env.VITE_WS_ENDPOINT);
  return url.toString();
};
