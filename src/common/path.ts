export const calcViewDocAPIEndpoint = (id: string): string => {
  const url = new URL(
    `/docs/${id}/view`,
    import.meta.env.VITE_WS_ENDPOINT,
  );
  return url.toString();
};

export const calcEditDocAPIEndpoint = (id: string): string => {
  const url = new URL(
    `/docs/${id}/edit`,
    import.meta.env.VITE_WS_ENDPOINT,
  );
  return url.toString();
};

export const calcEnterDocAPIEndpoint = (documentId: string) => {
  const url = new URL(
    `/docs/${documentId}/enter`,
    import.meta.env.VITE_HTTP_ENDPOINT,
  );
  return url.toString();
};

export const calcRedirectAPIEndpoint = (
  context: string | null,
  term: string,
) => {
  const url = new URL(
    context ? `/redirects/${context}/${term}` : `/redirects/_/${term}`,
    import.meta.env.VITE_HTTP_ENDPOINT,
  );
  return url.toString();
};

export const calcLocalDocPath = (id: string) => `/docs/${id}`;

export const calcLocalRedirectPath = (context: string | null, term: string) =>
  context ? `/redirects/${context}/${term}` : `/redirects/_/${term}`;
