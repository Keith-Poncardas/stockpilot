import * as z from "zod";

export const customerSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required").max(100, "First name is too long"),
    lastName: z.string().trim().min(1, "Last name is required").max(100, "Last name is too long"),
    phone: z.string().trim().max(20, "Phone number is too long").optional(),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Must be a valid email address")
        .optional()
        .or(z.literal("")),
    addressLine1: z.string().trim().max(255, "Address Line 1 is too long").optional(),
    addressLine2: z.string().trim().max(255, "Address Line 2 is too long").optional(),
    provinceCode: z.string().trim().min(1, "Province is required"),
    cityCode: z.string().trim().min(1, "City/Municipality is required"),
    postalCode: z.string().trim().max(10, "Postal Code is too long").optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
