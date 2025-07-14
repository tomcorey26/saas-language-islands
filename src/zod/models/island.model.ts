import { IslandTable } from "@/drizzle/island";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const IslandModel = createSelectSchema(IslandTable);

export type Island = z.infer<typeof IslandModel>;
