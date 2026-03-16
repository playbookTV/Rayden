import type { FieldPath, FieldValues, UseFormReturn, UseFormRegisterReturn } from "react-hook-form";

export interface UseRaydenInputOptions<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
}

export type UseRaydenInputReturn<TName extends string = string> = UseFormRegisterReturn<TName> & {
  error?: string;
  hasError: boolean;
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
  const error = form.formState.errors[name];
  const errorMessage = error?.message as string | undefined;

  return {
    ...registerProps,
    error: errorMessage,
    hasError: !!error,
  };
}
