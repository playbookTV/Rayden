import type { FieldPath, FieldValues, UseFormReturn, UseFormRegisterReturn } from "react-hook-form";

export interface UseRaydenInputOptions<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
}

export type UseRaydenInputReturn<TName extends string = string> = UseFormRegisterReturn<TName> & {
  /** Validation message for the field, if any. Maps to Input's `error` prop. */
  error?: string;
};

/**
 * Adapter hook for using Rayden Input with react-hook-form.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { Input, useRaydenInput } from "@raydenui/ui";
 *
 * function MyForm() {
 *   const form = useForm<{ email: string }>();
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <Input
 *         label="Email"
 *         placeholder="Enter your email"
 *         {...useRaydenInput({ form, name: "email" })}
 *       />
 *     </form>
 *   );
 * }
 * ```
 */
export function useRaydenInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ form, name }: UseRaydenInputOptions<TFieldValues, TName>): UseRaydenInputReturn<TName> {
  const registerProps = form.register(name);
  // `name` is a FieldPath, so it may be "profile.email" or "items.0.qty". React Hook
  // Form stores errors as a nested object mirroring the data, so errors[name] misses
  // every nested field. getFieldState resolves the path; passing formState keeps the
  // proxy subscription that makes it re-render.
  const { error } = form.getFieldState(name, form.formState);

  return {
    ...registerProps,
    error: error?.message as string | undefined,
  };
}
