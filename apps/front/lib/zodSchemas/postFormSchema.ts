import z from "zod";

export const PostFormSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().min(5),
  tags: z
    .string()
    .min(1)
    .refine((value) => value.split(",").every((tag) => tag.trim() !== ""))
    .transform((value) => value.split(",")),
  thumbnail: z.instanceof(File).optional(),
  published: z.preprocess((val) => val === "on" || val === "true", z.boolean()),
});
