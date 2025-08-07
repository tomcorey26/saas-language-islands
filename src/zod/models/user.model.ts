import { UserTable } from "@/drizzle/user";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const UserModel = createSelectSchema(UserTable);

export type User = z.infer<typeof UserModel>;
