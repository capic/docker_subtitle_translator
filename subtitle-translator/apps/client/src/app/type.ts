import { Dree } from 'dree';
import { z } from 'zod';

export type ModifiedDree<T extends Dree> = { uuid: string } & {
  [K in keyof T]: K extends 'children' ? ModifiedDreeProps<T[K]> : T[K];
};

type ModifiedDreeProps<T> = {
  [K in keyof T]: T[K] extends Dree ? ModifiedDree<T[K]> : T[K];
};


const subtitleSchema = z.object({
  number: z.number(),
  language: z.string(),
  type: z.string(),
  name: z.string().optional(),
})
export const subtitlesSchema = z.array(subtitleSchema);


export type Subtitle = z.infer<typeof subtitleSchema>
export type Subtitles = z.infer<typeof subtitlesSchema>