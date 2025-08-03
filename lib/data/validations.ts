import { z } from "zod";

export const deleteLogSchema = z.object({
  id: z.string(),
});

export const getLeadDataSchema = z.object({
  id: z.string(),
});

const ValidationType = z.enum(
  [
    "string", "email", "phone", "number", "date", "boolean", "url", "zip_code",
    "select", "multiselect", "radio", "checkbox", "textarea", "file", "range", "color"
  ],
  {
    errorMap: () => ({ message: "Please select a valid field type." }),
  }
);

export const createEndpointFormSchema = z.object({
  name: z.string().min(1, "Not a valid name."),
  schema: z.array(
    z.object({
      key: z.string().min(1, { message: "Please enter a valid field name." }),
      value: ValidationType,
      required: z.boolean().optional(),
      options: z.array(z.string()).optional(),
      placeholder: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      accept: z.string().optional(),
      multiple: z.boolean().optional(),
    })
  ),
  formEnabled: z.boolean(),
  successUrl: z.string().url().optional(),
  failUrl: z.string().url().optional(),
  webhookEnabled: z.boolean(),
  webhook: z.string().url().optional(),
});

export const updateEndpointFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Not a valid name."),
  schema: z.array(
    z.object({
      key: z.string().min(1, { message: "Please enter a valid field name." }),
      value: ValidationType,
      required: z.boolean().optional(),
      options: z.array(z.string()).optional(),
      placeholder: z.string().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
      step: z.number().optional(),
      accept: z.string().optional(),
      multiple: z.boolean().optional(),
    })
  ),
  formEnabled: z.boolean(),
  successUrl: z.string().url().optional(),
  failUrl: z.string().url().optional(),
  webhookEnabled: z.boolean(),
  webhook: z.string().url().optional(),
});
