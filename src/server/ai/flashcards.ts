// TODO: Change to something that auto generates the api client and api routes, and react-query hooks

import { api } from "@/server/apiClient";
import {
  CreateWorldRequest,
  CreateWorldResponse,
} from "@/zod/contracts/world.schema";

export async function generateIslands(
  data: CreateWorldRequest
): Promise<CreateWorldResponse> {
  return api.post("/world", data);
}
