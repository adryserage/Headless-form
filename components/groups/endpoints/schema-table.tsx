import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SchemaTable({ schema }: { schema: GeneralSchema[] }) {
  return (
    <div className="max-w-4xl pb-6 prose dark:prose-invert">
      <h3>Schema</h3>
      <Table className="not-prose">
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Required</TableHead>
            <TableHead>Configuration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schema.map((field, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{field?.key}</TableCell>
              <TableCell>
                <Badge variant="outline">{field?.value}</Badge>
              </TableCell>
              <TableCell>
                {field?.required ? (
                  <Badge variant="destructive">Required</Badge>
                ) : (
                  <Badge variant="secondary">Optional</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {field?.placeholder && (
                  <div>Placeholder: "{field.placeholder}"</div>
                )}
                {field?.options && field.options.length > 0 && (
                  <div>Options: {field.options.join(", ")}</div>
                )}
                {(field?.min !== undefined || field?.max !== undefined) && (
                  <div>
                    Range: {field?.min ?? "∞"} - {field?.max ?? "∞"}
                    {field?.step && ` (step: ${field.step})`}
                  </div>
                )}
                {field?.accept && <div>File types: {field.accept}</div>}
                {field?.multiple && <div>Multiple files allowed</div>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
