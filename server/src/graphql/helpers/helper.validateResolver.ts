import z, { ZodType } from "zod";
import { throwBadInput } from "@/utils";
import { Resolver } from "./types";

export function validate<T>(
    schema: ZodType<T>,
    selector: (args: any) => unknown = (args) => args.input
) {
    return (resolver: Resolver): Resolver => {
        return async (parent, args, context, info) => {
            const result = schema.safeParse(selector(args));

            if (!result.success) {
                throwBadInput("Validation failed", {
                    validation: z.flattenError(result.error),
                });
            }

            return resolver(parent, args, context, info);
        };
    };
}
