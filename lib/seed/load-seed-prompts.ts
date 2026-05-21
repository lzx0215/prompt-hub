import { readFile } from "node:fs/promises";
import { z } from "zod";

const seedPromptSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string().min(1)),
  content: z.string().min(1),
  exampleInput: z.string().min(1),
  exampleOutput: z.string().min(1),
  structureRole: z.string().min(1),
  structureTask: z.string().min(1),
  structureContext: z.string().min(1),
  structureConstraints: z.string().min(1),
  structureOutputFormat: z.string().min(1),
  weakPrompt: z.string().min(1),
  improvedPrompt: z.string().min(1),
  improvementNotes: z.string().min(1),
  language: z.string().min(1),
  isFeatured: z.boolean(),
  status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).default("PUBLISHED"),
});

export type SeedPrompt = z.infer<typeof seedPromptSchema>;

export async function loadSeedPrompts(path: string): Promise<SeedPrompt[]> {
  const raw = await readFile(path, "utf8");
  const data = JSON.parse(raw);

  return z.array(seedPromptSchema).parse(data);
}
