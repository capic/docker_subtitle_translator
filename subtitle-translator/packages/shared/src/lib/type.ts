import { Dree } from 'dree';
import { z } from 'zod';

export type ModifiedDree<T extends Dree> = { uuid: string } & {
  [K in keyof T]: K extends 'children' ? ModifiedDreeProps<T[K]> : T[K];
};

type ModifiedDreeProps<T> = {
  [K in keyof T]: T[K] extends Dree ? ModifiedDree<T[K]> : T[K];
};

const originSchema = z.enum(['Addic7ed', 'External', 'Internal']);

const subtitleSchema = z
  .object({
    uuid: z.string(),
    number: z.number().optional(),
    language: z.string().optional(),
    type: z.string().optional(),
    name: z.string().optional(),
    origin: z
      .literal(originSchema.Values.External)
      .or(z.literal(originSchema.Values.Internal)),
  })
  .or(
    z.object({
      uuid: z.string(),
      language: z.string(),
      origin: z.literal(originSchema.Values.Addic7ed),
      name: z.string(),
      link: z.string(),
      referer: z.string(),
    }),
  );
export const subtitlesSchema = subtitleSchema.array();
export const subInfoSchema = z.object({
  referer: z.string(),
  link: z.string(),
});

export type Subtitle = z.infer<typeof subtitleSchema>;
export type Subtitles = z.infer<typeof subtitlesSchema>;
export type Origin = z.infer<typeof originSchema>;
export type SubInfo = z.infer<typeof subInfoSchema>;
