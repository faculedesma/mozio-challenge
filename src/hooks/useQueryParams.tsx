import { useSearchParams } from 'react-router-dom';

export const useQueryParam = (): {
  searchParams: URLSearchParams;
  getQueryParam: (key: string) => string | null;
  removeQueryParam: (key: string) => void;
  updateQueryParam: (key: string, value: string) => void;
} => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateQueryParam = (key: string, value: string) => {
    setSearchParams((params) => {
      params.set(key, value.toString());
      return params;
    });
  };

  const removeQueryParam = (key: string) => {
    searchParams.delete(key);
    setSearchParams(`?${searchParams.toString()}`);
  };

  const getQueryParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  return {
    searchParams,
    getQueryParam,
    removeQueryParam,
    updateQueryParam
  };
};
