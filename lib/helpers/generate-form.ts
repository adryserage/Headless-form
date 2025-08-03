/**
 * Generates a Shadcn form based on the provided schema and URL.
 *
 * @param schema - The schema defining the form fields.
 * @param url - The URL to submit the form data to.
 * @returns The generated Shadcn form as a string.
 */
export const generateShadcnForm = (schema: GeneralSchema[]): string => {
  const getZodType = (field: GeneralSchema) => {
    let zodType = "";
    switch (field.value) {
      case "string":
      case "textarea":
        zodType = "z.string()";
        break;
      case "number":
      case "range":
        zodType = "z.number()";
        break;
      case "date":
        zodType = "z.date()";
        break;
      case "boolean":
        zodType = "z.boolean()";
        break;
      case "email":
        zodType = "z.string().email()";
        break;
      case "url":
        zodType = "z.string().url()";
        break;
      case "phone":
        zodType = "z.string().regex(/^\\+?[1-9]\\d{1,14}$/)";
        break;
      case "zip_code":
        zodType = "z.string().regex(/^\\d{5}(?:[-\\s]\\d{4})?$/)";
        break;
      case "select":
      case "radio":
        zodType = "z.string()";
        break;
      case "multiselect":
      case "checkbox":
        zodType = "z.array(z.string())";
        break;
      case "file":
        zodType = "z.string()";
        break;
      case "color":
        zodType = "z.string().regex(/^#[0-9A-F]{6}$/i)";
        break;
      default:
        zodType = "z.string()";
    }
    if (field.required) {
      if (field.value === "multiselect" || field.value === "checkbox") {
        zodType += ".min(1, { message: 'Please select at least one option' })";
      } else {
        zodType += ".min(1, { message: 'This field is required' })";
      }
    }
    return zodType;
  };

  const getFieldComponent = (field: GeneralSchema, fieldDef: GeneralSchema) => {
    const placeholder = fieldDef.placeholder || field.key;

    if (fieldDef.value === "boolean") {
      return `
        <Switch
          className="flex"
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      `;
    } else if (fieldDef.value === "date") {
      return `
        <Popover>
          <PopoverTrigger className="flex" asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      `;
    } else if (fieldDef.value === "textarea") {
      return `
        <Textarea
          placeholder="${placeholder}"
          {...field}
        />
      `;
    } else if (fieldDef.value === "select") {
      const options = fieldDef.options || [];
      return `
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger>
            <SelectValue placeholder="${placeholder}" />
          </SelectTrigger>
          <SelectContent>
            ${options.map((option) => `<SelectItem value="${option}">${option}</SelectItem>`).join("\n            ")}
          </SelectContent>
        </Select>
      `;
    } else if (fieldDef.value === "multiselect") {
      const options = fieldDef.options || [];
      return `
        <div className="space-y-2">
          {${JSON.stringify(options)}.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={\`${field.key}-\${option}\`}
                checked={field.value?.includes(option)}
                onCheckedChange={(checked) => {
                  const currentValues = field.value || [];
                  if (checked) {
                    field.onChange([...currentValues, option]);
                  } else {
                    field.onChange(currentValues.filter((v) => v !== option));
                  }
                }}
              />
              <label htmlFor={\`${field.key}-\${option}\`}>{option}</label>
            </div>
          ))}
        </div>
      `;
    } else if (fieldDef.value === "radio") {
      const options = fieldDef.options || [];
      return `
        <RadioGroup value={field.value} onValueChange={field.onChange}>
          {${JSON.stringify(options)}.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={\`${field.key}-\${option}\`} />
              <label htmlFor={\`${field.key}-\${option}\`}>{option}</label>
            </div>
          ))}
        </RadioGroup>
      `;
    } else if (fieldDef.value === "checkbox") {
      const options = fieldDef.options || [];
      return `
        <div className="space-y-2">
          {${JSON.stringify(options)}.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={\`${field.key}-\${option}\`}
                checked={field.value?.includes(option)}
                onCheckedChange={(checked) => {
                  const currentValues = field.value || [];
                  if (checked) {
                    field.onChange([...currentValues, option]);
                  } else {
                    field.onChange(currentValues.filter((v) => v !== option));
                  }
                }}
              />
              <label htmlFor={\`${field.key}-\${option}\`}>{option}</label>
            </div>
          ))}
        </div>
      `;
    } else if (fieldDef.value === "range") {
      const min = fieldDef.min || 0;
      const max = fieldDef.max || 100;
      const step = fieldDef.step || 1;
      return `
        <div className="space-y-2">
          <Slider
            value={[field.value || ${min}]}
            onValueChange={(value) => field.onChange(value[0])}
            max={${max}}
            min={${min}}
            step={${step}}
          />
          <div className="text-sm text-muted-foreground">
            Value: {field.value || ${min}}
          </div>
        </div>
      `;
    } else if (fieldDef.value === "file") {
      const accept = fieldDef.accept || "*/*";
      const multiple = fieldDef.multiple || false;
      return `
        <Input
          type="file"
          accept="${accept}"
          ${multiple ? "multiple" : ""}
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              ${multiple ? "field.onChange(Array.from(files).map(f => f.name));" : "field.onChange(files[0].name);"}
            }
          }}
        />
      `;
    } else if (fieldDef.value === "color") {
      return `
        <Input
          type="color"
          {...field}
        />
      `;
    } else {
      const inputType =
        fieldDef.value === "number"
          ? "number"
          : fieldDef.value === "email"
            ? "email"
            : fieldDef.value === "url"
              ? "url"
              : fieldDef.value === "phone"
                ? "tel"
                : "text";
      return `
        <Input
          placeholder="${placeholder}"
          {...field}
          type="${inputType}"
          ${fieldDef.min !== undefined ? `min={${fieldDef.min}}` : ""}
          ${fieldDef.max !== undefined ? `max={${fieldDef.max}}` : ""}
          ${fieldDef.step !== undefined ? `step={${fieldDef.step}}` : ""}
        />
      `;
    }
  };

  const hasBooleanField = schema.some((field) => field.value === "boolean");
  const hasDateField = schema.some((field) => field.value === "date");
  const hasTextareaField = schema.some((field) => field.value === "textarea");
  const hasSelectField = schema.some((field) => field.value === "select");
  const hasMultiselectField = schema.some(
    (field) => field.value === "multiselect",
  );
  const hasRadioField = schema.some((field) => field.value === "radio");
  const hasCheckboxField = schema.some(
    (field) => field.value === "checkbox" || field.value === "multiselect",
  );
  const hasRangeField = schema.some((field) => field.value === "range");

  return `"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
${
  hasBooleanField
    ? `
import { Switch } from "@/components/ui/switch";
`
    : ""
}
${
  hasDateField
    ? `
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
`
    : ""
}
${
  hasTextareaField
    ? `
import { Textarea } from "@/components/ui/textarea";
`
    : ""
}
${
  hasSelectField
    ? `
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
`
    : ""
}
${
  hasCheckboxField
    ? `
import { Checkbox } from "@/components/ui/checkbox";
`
    : ""
}
${
  hasRadioField
    ? `
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
`
    : ""
}
${
  hasRangeField
    ? `
import { Slider } from "@/components/ui/slider";
`
    : ""
}
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  ${schema.map((field) => `${field.key}: ${getZodType(field)}`).join(",\n  ")}
});

export function RouterForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        ${schema
          .map(
            (field) => `
        <FormField
          control={form.control}
          name="${field.key}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.key}</FormLabel>
              <FormControl>
                ${getFieldComponent(field, schema.find((f) => f.key === field.key)!)}
              </FormControl>
              <FormDescription>
                ${`Enter the ${field.key} for the endpoint.`}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        `,
          )
          .join("")}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
`;
};
