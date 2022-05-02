import { URLSearchParams } from "url";

export const fetcher = async (
  url: string,
  queryParams: {
    [key: string]: string;
  }
) => {
  const searchParams = queryParams
    ? "?" +
      new URLSearchParams({
        ...queryParams,
      })
    : "";
  const res = await fetch(url + searchParams);
  return res.json();
};
