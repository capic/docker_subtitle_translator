import { Dree } from 'dree';
import { z } from 'zod';

export type ModifiedDree<T extends Dree> = { uuid: string } & {
  [K in keyof T]: K extends 'children' ? ModifiedDreeProps<T[K]> : T[K];
};

type ModifiedDreeProps<T> = {
  [K in keyof T]: T[K] extends Dree ? ModifiedDree<T[K]> : T[K];
};


const subtitleSchema = z.object({
  number: z.number().optional(),
  language: z.string().optional(),
  type: z.string().optional(),
  name: z.string().optional(),
  downloadUrl: z.string().optional()
})
export const subtitlesSchema = subtitleSchema.array();


export type Subtitle = z.infer<typeof subtitleSchema>
export type Subtitles = z.infer<typeof subtitlesSchema>
