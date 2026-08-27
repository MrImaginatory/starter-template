import { useEffect, useRef, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete, ApiRequestOptions } from './api';

export const useApi = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const get = useCallback(async <T>(url: string, options?: ApiRequestOptions): Promise<T> => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    return apiGet<T>(url, { ...options, signal: abortControllerRef.current.signal });
  }, []);

  const post = useCallback(async <T>(url: string, data?: unknown, options?: ApiRequestOptions): Promise<T> => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    return apiPost<T>(url, data, { ...options, signal: abortControllerRef.current.signal });
  }, []);

  const put = useCallback(async <T>(url: string, data?: unknown, options?: ApiRequestOptions): Promise<T> => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    return apiPut<T>(url, data, { ...options, signal: abortControllerRef.current.signal });
  }, []);

  const del = useCallback(async <T>(url: string, options?: ApiRequestOptions): Promise<T> => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    return apiDelete<T>(url, { ...options, signal: abortControllerRef.current.signal });
  }, []);

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { get, post, put, del, abort };
};
