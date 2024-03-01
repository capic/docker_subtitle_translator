import { Dree } from 'dree';
import { z } from 'zod';

export type ModifiedDree<T extends Dree> = { uuid: string } & {
  [K in keyof T]: K extends 'children' ? ModifiedDreeProps<T[K]> : T[K];
};

type ModifiedDreeProps<T> = {
  [K in keyof T]: T[K] extends Dree ? ModifiedDree<T[K]> : T[K];
};

const originSchema = z.enum(['Addic7ed', 'External', 'Internal']);

const internalSubtitleSchema = z.object({
  uuid: z.string(),
  number: z.number(),
  language: z.string().optional(),
  type: z.string().optional(),
  name: z.string().optional(),
  origin: z.literal(originSchema.Values.Internal),
});
const externalSubtitleSchema = z.object({
  uuid: z.string(),
  language: z.string().optional(),
  name: z.string().optional(),
  origin: z.literal(originSchema.Values.External),
});
const addic7edSubtitleSchema = z.object({
  uuid: z.string(),
  language: z.string(),
  origin: z.literal(originSchema.Values.Addic7ed),
  name: z.string(),
  link: z.string(),
  referer: z.string(),
});

const subtitleSchema = internalSubtitleSchema
  .or(externalSubtitleSchema)
  .or(addic7edSubtitleSchema);
export const subtitlesSchema = subtitleSchema.array();
export const subInfoSchema = z.object({
  referer: z.string(),
  link: z.string(),
});

export type InternalSubtitle = z.infer<typeof internalSubtitleSchema>;
export type ExternalSubtitle = z.infer<typeof externalSubtitleSchema>;
export type Addic7edSubtitle = z.infer<typeof addic7edSubtitleSchema>;
export type Subtitle = z.infer<typeof subtitleSchema>;
export type Subtitles = z.infer<typeof subtitlesSchema>;
export type Origin = z.infer<typeof originSchema>;
export type SubInfo = z.infer<typeof subInfoSchema>;
