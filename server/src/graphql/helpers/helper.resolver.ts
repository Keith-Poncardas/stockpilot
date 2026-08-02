import { mapPrismaError } from "./helper.prismaError";
import { Resolver } from "./types";

export function resolver<TArgs = any, TResult = any, TParent = any>(
    fn: Resolver<TArgs, TResult, TParent>
): Resolver<TArgs, TResult, TParent>;
export function resolver<T extends Record<string, any>>(resolversObj: T): T;
export function resolver(input: any): any {
    if (typeof input === "function") {
        return async (parent: any, args: any, context: any, info: any) => {
            try {
                return await input(parent, args, context, info);
            } catch (error) {
                throw mapPrismaError(error);
            }
        };
    }

    if (input && typeof input === "object") {
        const wrapped = {} as any;
        for (const key in input) {
            const val = input[key];
            if (typeof val === "function") {
                wrapped[key] = resolver(val);
            } else {
                wrapped[key] = val;
            }
        }
        return wrapped;
    }

    return input;
}
