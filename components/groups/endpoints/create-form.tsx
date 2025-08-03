"use client";

import * as React from "react";

// type imports
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";

import { validationOptions } from "@/lib/validation";
import { createEndpointFormSchema as formSchema } from "@/lib/data/validations";

// next imports
import Link from "next/link";
import { useRouter } from "next/navigation";

// UI Imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAction } from "next-safe-action/hooks";
import { parseActionError } from "@/lib/utils/action-error";
import { createEndpoint } from "@/lib/data/endpoints";

type DomainValues = z.infer<typeof formSchema>;

const defaultValues: Partial<DomainValues> = {
  name: "",
  schema: [{ key: "", value: "string", required: false }],
  formEnabled: false,
  successUrl: undefined,
  failUrl: undefined,
  webhookEnabled: false,
  webhook: undefined,
};

export default function CreateForm() {
  const { execute, isExecuting } = useAction(createEndpoint, {
    onSuccess() {
      toast.success("Endpoint created successfully.");
    },
    onError({ error }) {
      toast.error(parseActionError(error));
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "schema",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => execute(values))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endpoint Name</FormLabel>
              <FormControl className="bg-secondary">
                <Input placeholder="Name your endpoint..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Schema */}
        <div className="border-y py-6 my-6 grid gap-4">
          <h3 className="text-sm font-medium">Schema</h3>
          {fields.map((field: any, index: any) => {
            const selectedFieldType = form.watch(`schema.${index}.value`);
            const needsOptions = [
              "select",
              "multiselect",
              "radio",
              "checkbox",
            ].includes(selectedFieldType);
            const needsRange = ["range", "number"].includes(selectedFieldType);
            const needsFile = selectedFieldType === "file";

            return (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                {/* Field Name and Type Row */}
                <div className="grid grid-cols-2 items-start w-full gap-4">
                  <FormField
                    control={form.control}
                    name={`schema.${index}.key`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl className="w-full">
                          <Input
                            {...field}
                            className="w-full bg-secondary"
                            placeholder="Field name..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`schema.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex gap-2 items-center">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl className="bg-secondary">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {validationOptions.map(
                                (type, typeIndex: number) => (
                                  <SelectItem key={typeIndex} value={type.name}>
                                    {type.name}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            className="border w-10 h-10 transition-all p-1"
                            variant="link"
                            onClick={() => remove(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Required Toggle */}
                <FormField
                  control={form.control}
                  name={`schema.${index}.required`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">
                          Required Field
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Placeholder Field */}
                <FormField
                  control={form.control}
                  name={`schema.${index}.placeholder`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Placeholder Text (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-secondary"
                          placeholder="Enter placeholder text..."
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Options for select, multiselect, radio, checkbox */}
                {needsOptions && (
                  <FormField
                    control={form.control}
                    name={`schema.${index}.options`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Options (one per line)
                        </FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full min-h-[100px] p-3 rounded-md border bg-secondary resize-vertical"
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            value={field.value?.join("\n") || ""}
                            onChange={(e) => {
                              const options = e.target.value
                                .split("\n")
                                .filter((opt) => opt.trim());
                              field.onChange(options);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Range/Number Settings */}
                {needsRange && (
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`schema.${index}.min`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Min Value</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="bg-secondary"
                              placeholder="0"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                )
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schema.${index}.max`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Max Value</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="bg-secondary"
                              placeholder="100"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                )
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schema.${index}.step`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Step</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="bg-secondary"
                              placeholder="1"
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                )
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* File Settings */}
                {needsFile && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`schema.${index}.accept`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">
                            Accepted File Types
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-secondary"
                              placeholder="image/*,.pdf,.doc"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`schema.${index}.multiple`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm">
                              Multiple Files
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({ key: "", value: "string", required: false });
            }}
          >
            Add Field +
          </Button>
        </div>

        {/* Redirect Urls */}
        <div className="border-b pb-6 my-6 space-y-2">
          <FormField
            control={form.control}
            name="formEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="">Enable HTML Form Posting</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("formEnabled") && (
            <>
              <p className="text-muted-foreground italic text-xs">
                *Redirect URLs are only used when posting a lead by HTML form
              </p>
              <FormField
                control={form.control}
                name="successUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Success Redirect URL</FormLabel>
                    <FormControl className="bg-secondary">
                      <Input
                        placeholder="Success URL..."
                        {...field}
                        disabled={!form.watch("formEnabled")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="failUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fail Redirect URL</FormLabel>
                    <FormControl className="bg-secondary">
                      <Input
                        placeholder="Fail URL..."
                        {...field}
                        disabled={!form.watch("formEnabled")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        {/* Webhook */}
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="webhookEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="">Include Webhook</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-readonly
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("webhookEnabled") && (
            <FormField
              control={form.control}
              name="webhook"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Webhook</FormLabel>
                  <FormControl className="w-full">
                    <div className="flex gap-2 items-center">
                      <Input
                        {...field}
                        className="w-full bg-secondary"
                        placeholder="Webhook URL ..."
                        disabled={!form.watch("webhookEnabled")}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button type="submit" className="mt-12" loading={isExecuting}>
          Create Endpoint
        </Button>
      </form>
    </Form>
  );
}
