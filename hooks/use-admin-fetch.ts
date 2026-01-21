import { useCallback, useEffect, useRef, useState } from 'react';

interface Options<T> {
  immediate?: boolean;
  selector?: (response: any) => T;
  onSuccess?: (data: T) => void;
}

type RefreshOptions = {
  silent?: boolean;
};

export function useAdminFetch<T = unknown>(url: string, options: Options<T> = {}) {
  const { immediate = true, selector, onSuccess } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);
  const selectorRef = useRef<typeof selector>(selector);
  const onSuccessRef = useRef<typeof onSuccess>(onSuccess);

  useEffect(() => {
    selectorRef.current = selector;
  }, [selector]);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const fetchData = useCallback(async (fetchOptions: RefreshOptions = {}) => {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;

    try {
      if (!fetchOptions.silent) {
        setLoading(true);
      }
      setError(null);
      const res = await fetch(url, { signal: controller.signal });

      if (res.status === 401 || res.status === 403) {
        const redirect = encodeURIComponent(window.location.pathname);
        window.location.href = `/admin/login?redirect=${redirect}`;
        return;
      }

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch data');
      }

      const selectorFn = selectorRef.current;
      const payload = selectorFn ? selectorFn(json) : (json as T);
      setData(payload);
      onSuccessRef.current?.(payload);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Failed to fetch data');
    } finally {
      if (!fetchOptions.silent) {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => {
      abortController.current?.abort();
    };
  }, [fetchData, immediate]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
  };
}
