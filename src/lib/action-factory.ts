import z, { ZodTypeAny } from "zod";

function unwrapError(e: unknown): Error {
  if (e instanceof Error) {
    return e;
  }
  return new Error(typeof e === "string" ? e : "Unknown error");
}

function actionFactory<T extends ZodTypeAny, R>(
  cb: (data: z.infer<T>) => R,
  schema: T
) {
  return (...args: [z.infer<T>]) => {
    try {
      const parsed = schema.parse(args[0]);
      return cb(parsed);
    } catch (e) {
      const error = unwrapError(e);
      return {
        error: true,
        message: "Incorrect Data provided",
        details: error.message,
      };
    }
  };
}
