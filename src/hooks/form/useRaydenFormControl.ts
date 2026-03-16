import type { FieldPath, FieldValues, UseFormReturn, UseFormRegisterReturn } from "react-hook-form";

export interface UseRaydenFormControlOptions<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  form: UseFormReturn<TFieldValues>;
  name: TName;
}

export type UseRaydenCheckboxReturn<TName extends string = string> = UseFormRegisterReturn<TName>;

export type UseRaydenRadioReturn<TName extends string = string> = UseFormRegisterReturn<TName> & {
  value: string;
};

/**
 * Adapter hook for using Rayden Checkbox with react-hook-form.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { Checkbox, useRaydenCheckbox } from "@raydenui/ui";
 *
 * function MyForm() {
 *   const form = useForm<{ agree: boolean }>();
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <Checkbox
 *         label="I agree to the terms"
 *         {...useRaydenCheckbox({ form, name: "agree" })}
 *       />
 *     </form>
 *   );
 * }
 * ```
 */
export function useRaydenCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
}: UseRaydenFormControlOptions<TFieldValues, TName>): UseRaydenCheckboxReturn<TName> {
  return form.register(name);
}

/**
 * Adapter hook for using Rayden Toggle with react-hook-form.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { Toggle, useRaydenToggle } from "@raydenui/ui";
 *
 * function MyForm() {
 *   const form = useForm<{ notifications: boolean }>();
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <Toggle
 *         label="Enable notifications"
 *         {...useRaydenToggle({ form, name: "notifications" })}
 *       />
 *     </form>
 *   );
 * }
 * ```
 */
export function useRaydenToggle<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
}: UseRaydenFormControlOptions<TFieldValues, TName>): UseRaydenCheckboxReturn<TName> {
  return form.register(name);
}

/**
 * Adapter hook for using Rayden Radio with react-hook-form.
 *
 * @example
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { Radio, useRaydenRadio } from "@raydenui/ui";
 *
 * function MyForm() {
 *   const form = useForm<{ plan: string }>();
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <Radio label="Basic" {...useRaydenRadio({ form, name: "plan", value: "basic" })} />
 *       <Radio label="Pro" {...useRaydenRadio({ form, name: "plan", value: "pro" })} />
 *     </form>
 *   );
 * }
 * ```
 */
export function useRaydenRadio<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  value,
}: UseRaydenFormControlOptions<TFieldValues, TName> & {
  value: string;
}): UseRaydenRadioReturn<TName> {
  return {
    ...form.register(name),
    value,
  };
}
