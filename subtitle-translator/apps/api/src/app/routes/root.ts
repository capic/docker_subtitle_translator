import { FastifyInstance } from 'fastify';
import * as dree from 'dree';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import {
  getSubtitlesFromAddic7ed,
  getSubtitlesFromDirectory,
  getSubtitlesFromFile,
} from '../../utils/getSubtitles';
import { ModifiedDree, SubInfo } from '@subtitle-translator/shared';
import download from '../../addic7ed-api/download';

const children: dree.Dree[] = [
  {
    name: 'Séries en cours',
    path: '/data/media/series_en_cours',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
  },
  {
    name: 'Films à regarder',
    path: '/data/media/films_a_regarder',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
  },
  {
    name: 'Séries VO',
    path: '/data/media/series_vo',
    // path: '/mnt/c/_D',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
  },
];

export const directoryMap = new Map<string, dree.Dree>();
export const fileMap = new Map<string, dree.Dree>();

const fileCallback = function (file: ModifiedDree<dree.Dree>) {
  file.uuid = uuidv4();
  logger.debug(`Add file ${file.name} to map with uuid ${file.uuid}`);
  fileMap.set(file.uuid, file);
};
const directoryCallback = function (directory: ModifiedDree<dree.Dree>) {
  directory.uuid = uuidv4();
  logger.debug(`Add file ${directory.name} to map with uuid ${directory.uuid}`);
  directoryMap.set(directory.uuid, directory);
};

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/files', async () => {
    const tree: dree.Dree = {
      name: 'root',
      path: '/',
      type: dree.Type.DIRECTORY,
      relativePath: '.',
      isSymbolicLink: false,
      children: children.map((item) =>
        dree.scan(
          item.path,
          {
            depth: 0,
            stat: false,
            symbolicLinks: false,
            followLinks: false,
            size: false,
            hash: false,
            showHidden: false,
            emptyDirectory: false,
            descendants: false,
            extensions: ['mkv'],
          },
          fileCallback,
          directoryCallback,
        ),
      ),
    };

    return tree;
  });

  fastify.get<{ Params: { uuid: string } }>(
    '/api/directories/:uuid/files',
    async (request) => {
      const { uuid } = request.params;

      if (!uuid) {
        logger.error(`No uuid provided`);
        return {
          status: false,
          message: 'No file uuid',
        };
      }

      const directory = directoryMap.get(uuid);

      if (!directory) {
        logger.error(`No directory found with ${uuid}`);
        return {
          status: false,
          message: `No directory found with uuid ${uuid}`,
        };
      }

      logger.debug(`Get files from directory ${directory.name}`);

      const tree: dree.Dree = dree.scan(
        directory.path,
        {
          depth: 1,
          stat: false,
          symbolicLinks: false,
          followLinks: false,
          size: false,
          hash: false,
          showHidden: false,
          emptyDirectory: false,
          descendants: false,
          extensions: ['mkv'],
        },
        fileCallback,
        directoryCallback,
      );

      return tree;
    },
  );

  fastify.get<{ Params: { uuid: string } }>(
    '/api/files/:uuid/subtitles',
    async (request, reply) => {
      const { uuid } = request.params;

      if (!uuid) {
        logger.error(`No uuid provided`);
        return {
          status: false,
          message: 'No file hash',
        };
      }

      const file = fileMap.get(uuid);

      if (!file) {
        logger.error(`No directory found with ${uuid}`);
        return {
          status: false,
          message: 'No file found',
        };
      }

      try {
        const subtitlesFromDirectory = getSubtitlesFromDirectory(file);
        logger.debug(
          `subtitlesFromDirectory: ${JSON.stringify(subtitlesFromDirectory)}`,
        );
        const subtitlesFromAddic7ed = await getSubtitlesFromAddic7ed(file);
        logger.debug(
          `subtitlesFromAddic7ed: ${JSON.stringify(subtitlesFromAddic7ed)}`,
        );
        const subtitlesFromFile = await getSubtitlesFromFile(file);
        logger.debug(`subtitlesFromFile: ${JSON.stringify(subtitlesFromFile)}`);

        return [
          ...subtitlesFromDirectory,
          ...subtitlesFromFile,
          ...subtitlesFromAddic7ed,
        ];
      } catch (error) {
        logger.debug(`Error: ${error}`);
        reply.send(error);
      }
    },
  );

  fastify.post<{ Body: { uuid: string; number: number } }>(
    '/api/subtitles/translate',
    (request) => {
      const { uuid, number } = request.body;

      if (!uuid || !number) {
        logger.error(`No uuid or number provided`);
        return {
          status: false,
          message: 'No file uuid or track number',
        };
      }

      const file = fileMap.get(uuid);

      if (!file) {
        logger.error(`No file found with ${uuid}`);
        return {
          status: false,
          message: 'No file path',
        };
      }

      try {
        logger.debug(
          `mkvextract tracks "${file.path}" ${
            Number(number) - 1
          }:"/data/temp/${path.basename(file.path)}.srt"`,
        );

        const stdoutMkvextract = execSync(
          `mkvextract tracks "${file.path}" ${
            Number(number) - 1
          }:"/data/temp/${path.basename(file.path)}.srt"`,
        );

        // the *entire* stdout and stderr (buffered)
        console.info(stdoutMkvextract);
        //console.log(`stderr: ${stderr}`);
        /* fs.copyFileSync(`/data/temp/${path.basename(filePath)}.srt`,
        `/data/input/${path.basename(filePath)}.srt`) */
        logger.debug(
          `subtrans translate "/data/temp/${path.basename(
            file.path,
          )}.srt" --src en --dest fr`,
        );

        const stdoutSubtrans = execSync(
          `subtrans translate "/data/temp/${path.basename(
            file.path,
          )}.srt" --src en --dest fr`,
        );

        console.info(stdoutSubtrans);

        logger.debug(`remove /data/temp/${path.basename(file.path)}.srt`);
        fs.rmSync(`/data/temp/${path.basename(file.path)}.srt`);
        logger.debug(
          `move file to ${path.dirname(file.path)}/${path.basename(
            file.path,
          )}.fr.srt`,
        );
        fs.copyFileSync(
          `/data/temp/${path.basename(file.path)}.fr.srt`,
          `${path.dirname(file.path)}/${path.basename(file.path)}.fr.srt`,
        );
        fs.rmSync(`/data/temp/${path.basename(file.path)}.fr.srt`);

        return 'Sous titre extrait';
      } catch (error) {
        logger.error(`Error: ${error.message}`);
        return {
          status: false,
          message: error.message,
        };
      }
    },
  );

  fastify.post<{ Body: SubInfo & { uuid: string } }>(
    '/api/subtitles/download',
    async (request) => {
      const { referer, link, uuid } = request.body;

      if (!link || !referer || !uuid) {
        logger.error(`No referer or link or uuid provided`);
        return {
          status: false,
          message: 'No referer uuid or link or uuid',
        };
      }

      const file = fileMap.get(uuid);

      if (!file) {
        logger.error(`No file found with ${uuid}`);
        return {
          status: false,
          message: 'No file path',
        };
      }

      logger.debug(`Download file ${file.path}.srt with link ${link} and referer ${referer}`);
      await download({ link, referer }, `${file.path}.srt`);

      return 'Sous titre téléchargé';
    },
  );

  fastify.get('/local/subtitles-addic7ed', async () => {
    const file: dree.Dree = {
      name: 'Séries VO',
      // path: '/data/media/series_vo',
      path: '/mnt/c/_D/Reacher/Reacher.S01E01.Welcome.to.Margrave.1080p.10bit.WEBRip.6CH.x265.HEVC-PSA.mkv',
      type: dree.Type.FILE,
      relativePath: '.',
      isSymbolicLink: false,
    };
    return await getSubtitlesFromAddic7ed(file);
  });

  fastify.get('/local/subtitles-file', async () => {
    const file: dree.Dree = {
      name: 'Reacher.S01E01.Welcome.to.Margrave.1080p.10bit.WEBRip.6CH.x265.HEVC-PSA.mkv',
      // path: '/data/media/series_vo',
      path: '/mnt/c/_D/Reacher/Reacher.S01E01.Welcome.to.Margrave.1080p.10bit.WEBRip.6CH.x265.HEVC-PSA.mkv',
      type: dree.Type.FILE,
      relativePath: '.',
      isSymbolicLink: false,
    };
    return [...(await getSubtitlesFromFile(file))];
  });
}
