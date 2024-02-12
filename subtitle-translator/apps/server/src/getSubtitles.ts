import logger from './logger';
import path from 'path';
import fs from 'fs';
import * as dree from 'dree';
import { SubtitleParser } from 'matroska-subtitles';
import search from './addic7ed-api/search';

export const getSubtitlesFromFile = async (file: dree.Dree) => {
  logger.debug(`Get subtitles from file ${file.name}`);
  const parser = new SubtitleParser();

  const promise = new Promise<[]>((resolve) => {
    parser.once('tracks', (tracks) => {
      parser.destroy();
      logger.debug(`Tracks found ${tracks}`);
      resolve(tracks)
    })});

  fs.createReadStream(file.path).pipe(parser);

  return await promise
}

export const getSubtitlesFromDirectory= (file: dree.Dree) => {
  logger.debug(
    `Get subtitle files from ${path.dirname(file.path)} for ${path.basename(
      file.path,
    )}`,
  );
  const subs = fs
    .readdirSync(path.dirname(file.path))
    .filter(
      (fileName) =>
        path.extname(fileName) === '.srt' &&
        path.basename(fileName).includes(path.basename(file.path)),
    )
    .map((filteredFileName) => {
      const language = filteredFileName.split('.').at(-2);
      return { language, name: 'External' };
    });
  logger.debug(`Subtitles: ${subs} in directory ${path.dirname(file.path)}`);

  return subs
}

export const getSubtitlesFromAddic7ed =async  (file: dree.Dree) => {
  const show = path.dirname(file.path).split('/').at(-1);
  const match = path.basename(file.path).match(/S([0-9]*)E([0-9]*)/);
  const season = match[1];
  const episode = match[2];
  logger.debug(`Search addic7ed subtitles for ${show} S${season}E${episode}`);
  const addic7edSubtitles = await search({
    show,
    season,
    episode,
    languages: ['french'],
  });
  logger.debug(`Subtitles found on accict7ed: ${JSON.stringify(addic7edSubtitles)}`);

  return addic7edSubtitles?.downloadableSubtitles.map((addic7edSubtitle) => ({language: 'fr', name: addic7edSubtitle.version, donwloadUrl: addic7edSubtitle.link}))
}
