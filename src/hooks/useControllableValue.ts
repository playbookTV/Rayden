import { useCallback, useRef, useState } from "react";

/** Internal controlled/uncontrolled state; callback changes never reset the value. */
export function useControllableValue<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): readonly [T, (value: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const latest = useRef({ value, onChange });
  latest.current = { value, onChange };
  const setValue = useCallback((next: T) => {
    if (latest.current.value === undefined) setInternal(next);
    latest.current.onChange?.(next);
  }, []);
  return [value === undefined ? internal : value, setValue];
}
