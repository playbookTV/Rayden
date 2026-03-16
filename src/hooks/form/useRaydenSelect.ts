import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export interface UseRaydenSelectOptions<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
}

export interface UseRaydenSelectReturn {
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  hasError: boolean;
}

/**
 * Adapter hook for using Rayden Select with react-hook-form.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { Select, SelectOption, useRaydenSelect } from "@raydenui/ui";
 *
 * function MyForm() {
 *   const form = useForm<{ country: string }>();
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <Select
 *         label="Country"
 *         {...useRaydenSelect({ form, name: "country" })}
 *       >
 *         <SelectOption value="us">United States</SelectOption>
 *         <SelectOption value="uk">United Kingdom</SelectOption>
 *       </Select>
 *     </form>
 *   );
 * }
 * ```
 */
export function useRaydenSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ form, name }: UseRaydenSelectOptions<TFieldValues, TName>): UseRaydenSelectReturn {
  const value = form.watch(name) as string;
  const error = form.formState.errors[name];
  const errorMessage = error?.message as string | undefined;

  const onValueChange = (newValue: string) => {
    form.setValue(name, newValue as TFieldValues[TName], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return {
    value: value ?? "",
    onValueChange,
    error: errorMessage,
    hasError: !!error,
  };
}
