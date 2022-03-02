export const calcEndpointViewDoc = (id: string): string => {
  const url = new URL(
    `/docs/${id}/view`,
    import.meta.env.VITE_WS_ENDPOINT,
  );
  return url.toString();
};

export const calcEndpointEditDoc = (id: string): string => {
  const url = new URL(
    `/docs/${id}/edit`,
    import.meta.env.VITE_WS_ENDPOINT,
  );
  return url.toString();
};

export const calcEndpointDocEnter = (documentId: string) => {
  const url = new URL(
    `/docs/${documentId}/enter`,
    import.meta.env.VITE_HTTP_ENDPOINT,
  );
  return url.toString();
};

export const calcEndpointDocRedirects = (slug: string) => {
  const url = new URL(`/docs/${slug}/redirects`, import.meta.env.VITE_HTTP_ENDPOINT);
  return url.toString();
};

export const calcEndpointFindRedirects = (
  context: string | null,
  term: string,
) => {
  const url = new URL(`/redirects/find`, import.meta.env.VITE_HTTP_ENDPOINT);

  if (context) url.searchParams.set("context", context);
  url.searchParams.set("term", term);

  return url.toString();
};

export const calcEndpointAddRedirect = (
  slug: string,
  context: string,
  term: string,
) => {
  const url = new URL(`/redirects/add`, import.meta.env.VITE_HTTP_ENDPOINT);

  url.searchParams.set("slug", slug);
  url.searchParams.set("context", context);
  url.searchParams.set("term", term);

  return url.toString();
};

export const calcLocalDocPath = (id: string) => `/docs/${id}`;

export const calcLocalRedirectPath = (context: string | null, term: string) =>
  context ? `/redirects/${context}/${term}` : `/redirects/_/${term}`;
