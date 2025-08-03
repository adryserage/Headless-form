import * as z from "zod";
import validator from "validator";

/**
 * The validation types that are available
 *
 * These can be extended to have other validation types
 * Steps to add other validation options:
 * 1. add a key value pair in 'validationOptions' of the new validation type
 * 2. Add a zod schema definition in the 'validations' object in this file
 * 3. If necessary, add respective logic to correct / cast the type in the 'convertToCorrectTypes' function
 */
export const validationOptions: { name: ValidationType }[] = [
  { name: "string" },
  { name: "email" },
  { name: "phone" },
  { name: "number" },
  { name: "date" },
  { name: "boolean" },
  { name: "url" },
  { name: "zip_code" },
  { name: "select" },
  { name: "multiselect" },
  { name: "radio" },
  { name: "checkbox" },
  { name: "textarea" },
  { name: "file" },
  { name: "range" },
  { name: "color" },
];

/**
 * Zod validations for each validation type
 *
 * As mentioned above, this can be extended to add further validation types
 */
export const validations: { [key in ValidationType]: z.ZodType<any, any> } = {
  phone: z.string().refine(validator.isMobilePhone, {
    message: "Not a valid phone number.",
  }),
  email: z.string().email("Not a valid email."),
  string: z.string().min(1, "Field is required."),
  number: z.number().min(0, "Not a valid number."),
  date: z.date().min(new Date(), "Not a valid date."),
  boolean: z.boolean(),
  url: z.string().url("Not a valid URL."),
  zip_code: z
    .string()
    .min(5, "Not a valid zip code.")
    .max(5, "Not a valid zip code."),
  select: z.string().min(1, "Please select an option."),
  multiselect: z.array(z.string()).min(1, "Please select at least one option."),
  radio: z.string().min(1, "Please select an option."),
  checkbox: z.array(z.string()).min(1, "Please select at least one option."),
  textarea: z.string().min(1, "Field is required."),
  file: z.string().min(1, "Please upload a file."), // File path/URL after upload
  range: z.number().min(0, "Invalid range value."),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Not a valid color."),
};

/**
 * Converts the values in the provided data object to their correct types based on the given schema.
 *
 * @param data - The data object containing the values to be converted.
 * @param schema - An array of objects representing the schema, specifying the keys and their expected types.
 * @returns An object with the converted values.
 */
export const convertToCorrectTypes = (
  data: any,
  schema: GeneralSchema[],
): any => {
  const result: any = {};

  schema.forEach(({ key, value }) => {
    if (value === "boolean") {
      // Convert "true" and "false" strings to boolean values
      result[key] = data[key] === "true";
    } else if (value === "number" || value === "range") {
      // Convert string to number, ensuring NaN is handled appropriately
      const num = Number(data[key]);
      result[key] = isNaN(num) ? undefined : num;
    } else if (value === "multiselect" || value === "checkbox") {
      // Ensure array format for multi-value fields
      if (Array.isArray(data[key])) {
        result[key] = data[key];
      } else if (typeof data[key] === "string") {
        // Handle comma-separated values or JSON string
        try {
          result[key] = JSON.parse(data[key]);
        } catch {
          result[key] = data[key].split(",").map((item: string) => item.trim());
        }
      } else {
        result[key] = [];
      }
    } else if (value === "date") {
      // Convert string to Date object
      result[key] = data[key] ? new Date(data[key]) : undefined;
    } else {
      // For all other types, assume string or no conversion needed
      result[key] = data[key];
    }
  });

  return result;
};

/**
 * Generates a dynamic schema based on the provided schema array.
 *
 * @param schema - An array of GeneralSchema objects representing the schema.
 * @returns A ZodRawShape object representing the generated dynamic schema.
 */
export const generateDynamicSchema = (
  schema: GeneralSchema[],
): z.ZodRawShape => {
  return schema.reduce<z.ZodRawShape>((acc, { key, value }) => {
    const validation = validations[value];
    if (validation) {
      acc[key as keyof SchemaToZodMap] = validation;
    }
    return acc;
  }, {});
};

/**
 * Validates and parses the given data using the provided dynamic schema.
 *
 * @param dynamicSchema - The dynamic schema used for validation.
 * @param data - The data to be validated and parsed.
 * @returns The result of the validation and parsing operation.
 */
export const validateAndParseData = (
  dynamicSchema: z.ZodRawShape,
  data: any,
): z.SafeParseReturnType<
  {
    [x: string]: any;
  },
  {
    [x: string]: any;
  }
> => {
  const EndpointZodSchema = z.object(dynamicSchema);

  Object.keys(dynamicSchema).forEach((key) => {
    const validation = dynamicSchema[key];
    console.log(`Field: ${key}, Validation: ${validation._def.typeName}`);
  });

  return EndpointZodSchema.safeParse(data);
};
