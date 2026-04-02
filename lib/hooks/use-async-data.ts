"use client";

import { useEffect, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useAsyncData<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    loader()
      .then((data) => {
        if (isActive) {
          setState({ data, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error.message : "Unexpected error",
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [loader]);

  return state;
}
