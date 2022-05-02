export function generateGetMethodWithQueries(
  url: string,
  queryParams: {
    [key: string]: string;
  }
) {
  const searchParams = queryParams
    ? "?" +
      new URLSearchParams({
        ...queryParams,
      })
    : "";
  return url + searchParams;
}
