import { z } from 'zod'

export const ScraperVisibility = z.enum(['private', 'org'])

export const ScraperSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string().min(1),
  enabled: z.boolean(),
  visibility: ScraperVisibility,
})

export const CreateScraperInput = z.object({
  orgId: z.string(),
  name: z.string().min(1),
  enabled: z.boolean().default(true),
  visibility: ScraperVisibility.default('org'),
})

export const UpdateScraperInput = z.object({
  name: z.string().min(1).optional(),
  enabled: z.boolean().optional(),
  visibility: ScraperVisibility.optional(),
})

export type CreateScraperInput = z.infer<typeof CreateScraperInput>
export type UpdateScraperInput = z.infer<typeof UpdateScraperInput>
