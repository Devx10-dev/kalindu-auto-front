import { useState, useEffect, useCallback } from "react";

function useQueryParams() {
  const [queryParams, setQueryParams] = useState<any>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    setQueryParams(params);
  }, []);

  // Function to update a query parameter
  const setQueryParam = useCallback((key, value) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set(key, value);
    const newUrl = window.location.pathname + "?" + searchParams.toString();
    window.history.pushState(null, "", newUrl);
    setQueryParams((prevParams) => ({ ...prevParams, [key]: value }));
  }, []);

  return { queryParams, setQueryParam };
}

export default useQueryParams;
