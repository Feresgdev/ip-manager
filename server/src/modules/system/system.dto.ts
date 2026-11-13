import { z } from "zod";

const tableNameSchema = z
  .string()
  .regex(/^[A-Za-z_][A-Za-z0-9_]*$/, "Invalid table name");

export const ConfirmDtoSchema = z
  .object({
    confirm: z.literal(true),
  })
  .strict();

export const DropTablesDtoSchema = z
  .object({
    tables: z.array(tableNameSchema).min(1).max(50),
    confirm: z.literal(true),
  })
  .strict();

// Inferred TypeScript DTO types
export type ConfirmDto = z.infer<typeof ConfirmDtoSchema>;
export type DropTablesDto = z.infer<typeof DropTablesDtoSchema>;
