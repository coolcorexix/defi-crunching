import { fetcher } from "backend-feature/utils/fetcher";
import { SimplePriceResponse } from "coingecko-api-v3";
import { useEffect, useState } from "react";
import useSWR from "swr";

export function useCurrentPrice(coindIds: string[]): SimplePriceResponse {
  const [constructedParameters, setConstructedParameters] =
    useState<string>("");
  useEffect(() => {
    if (coindIds.length === 0) {
      setConstructedParameters("");
      return;
    }
    setConstructedParameters(
      `?${coindIds.map((cId) => `coinIds=${cId}`).join("&")}`
    );
  }, [coindIds]);
  const shouldFetch = !!constructedParameters;
  const { data } = useSWR(
    shouldFetch
      ? "/api/get-current-price-of-coins" + constructedParameters
      : null,
    fetcher
  );
  console.log(
    "🚀 ~ file: useCurrentPrice.ts ~ line 7 ~ useCurrentPrice ~ data",
    data
  );
  return data ? data.coinGeckoPrices : undefined;
}
