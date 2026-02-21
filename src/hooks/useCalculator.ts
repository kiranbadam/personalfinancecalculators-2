'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export function useCalculator<TInputs, TResult>(
  defaultInputs: TInputs,
  calculateFn: (inputs: TInputs) => TResult,
  debounceMs: number = 150
) {
  const [inputs, setInputs] = useState<TInputs>(defaultInputs);
  const debouncedInputs = useDebounce(inputs, debounceMs);

  const result = useMemo(() => {
    return calculateFn(debouncedInputs);
  }, [debouncedInputs, calculateFn]);

  const updateInput = useCallback(<K extends keyof TInputs>(key: K, value: TInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs(defaultInputs);
  }, [defaultInputs]);

  return {
    inputs,
    setInputs,
    updateInput,
    result,
    reset,
  };
}
