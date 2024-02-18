import { FastifyInstance } from 'fastify';
import * as dree from 'dree';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';
import path from 'path';
import fs from 'fs';
import { SubtitleParser } from 'matroska-subtitles';
import { execSync } from 'child_process';

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
    // path: '/mnt/c/Users/Vincent/Downloads',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
  },
];

const directoryMap = new Map<string, dree.Dree>();
const fileMap = new Map<string, dree.Dree>();

const fileCallback = function (file: dree.Dree & { uuid: string }) {
  file.uuid = uuidv4();
  logger.debug(`Add file ${file.name} to map with uuid ${file.uuid}`);
  fileMap.set(file.uuid, file);
};
const directoryCallback = function (directory: dree.Dree & { uuid: string }) {
  directory.uuid = uuidv4();
  logger.debug(`Add file ${directory.name} to map with uuid ${directory.uuid}`);
  directoryMap.set(directory.uuid, directory);
};

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/files', async  () => {
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
          directoryCallback
        )
      ),
    };

    return tree;
  });
  fastify.get< {Params: {uuid: string}
}>('/api/directories/:uuid/files', async (request) => {
    const { uuid } = request.params;

    if (!uuid) {
      logger.error(`No uuid provided`);
      return {
        status: false,
        message: 'No file hash',
      }
    }

    const directory = directoryMap.get(uuid);

    if (!uuid) {
      logger.error(`No directory found with ${uuid}`);
      return {
        status: false,
        message: 'No file hash',
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
      directoryCallback
    );

    return tree;
  })

  fastify.get<{Params: {uuid: string}}>('/api/files/:uuid/subtitles', async (request, reply) => {
    const { uuid } = request.params;

    if (!uuid) {
      logger.error(`No uuid provided`);
      return {
        status: false,
        message: 'No file hash',
      }
    }

    const file = fileMap.get(uuid);

    if (!file) {
      logger.error(`No directory found with ${uuid}`);
      return {
        status: false,
        message: 'No file found',
      }
    }

    try {
      logger.debug(
        `Get subtitle files from ${path.dirname(file.path)} for ${path.basename(
          file.path
        )}`
      );
      const subs = fs
        .readdirSync(path.dirname(file.path))
        .filter(
          (fileName) =>
            path.extname(fileName) === '.srt' &&
            path.basename(fileName).includes(path.basename(file.path))
        )
        .map((filteredFileName) => {
          const language = filteredFileName.split('.').at(-2);
          return { language, name: 'External' };
        });
      logger.debug(`Subtitles: ${subs} in directory ${path.dirname(file.path)}`);

      logger.debug(`Get subtitles from file ${file.name}`);
      const parser = new SubtitleParser();

      parser.once('tracks', (tracks) => {
        parser.destroy();
        logger.debug(`Tracks found ${tracks}`);
        reply.send([...tracks, ...subs])
      });

      fs.createReadStream(file.path).pipe(parser);
    } catch (error) {
      logger.debug(`Error: ${error}`);
    }
  })




  fastify.post<{Body: {uuid: string, number: number}}>('/api/subtitles/translate', (request) => {
    const { uuid, number } = request.body;

    if (!uuid || !number) {
      logger.error(`No uuid or number provided`);
      return {
        status: false,
        message: 'No file uuid or track number',
      }
    }

    const file = fileMap.get(uuid);

    if (!file) {
      logger.error(`No file found with ${uuid}`);
      return {
        status: false,
        message: 'No file path',
      }
    }

    try {
      logger.debug(
        `mkvextract tracks "${file.path}" ${
          Number(number) - 1
        }:"/data/temp/${path.basename(file.path)}.srt"`
      );

      const stdoutMkvextract = execSync(
        `mkvextract tracks "${file.path}" ${
          Number(number) - 1
        }:"/data/temp/${path.basename(file.path)}.srt"`
      );

      // the *entire* stdout and stderr (buffered)
      console.info(stdoutMkvextract);
      //console.log(`stderr: ${stderr}`);
      /* fs.copyFileSync(`/data/temp/${path.basename(filePath)}.srt`,
        `/data/input/${path.basename(filePath)}.srt`) */
      logger.debug(
        `subtrans translate "/data/temp/${path.basename(
          file.path
        )}.srt" --src en --dest fr`
      );

      const stdoutSubtrans = execSync(
        `subtrans translate "/data/temp/${path.basename(
          file.path
        )}.srt" --src en --dest fr`
      );

      console.info(stdoutSubtrans);

      logger.debug(`remove /data/temp/${path.basename(file.path)}.srt`);
      fs.rmSync(`/data/temp/${path.basename(file.path)}.srt`);
      logger.debug(
        `move file to ${path.dirname(file.path)}/${path.basename(
          file.path
        )}.fr.srt`
      );
      fs.copyFileSync(
        `/data/temp/${path.basename(file.path)}.fr.srt`,
        `${path.dirname(file.path)}/${path.basename(file.path)}.fr.srt`
      );
      fs.rmSync(`/data/temp/${path.basename(file.path)}.fr.srt`);

      return {
        status: true,
        message: 'Srt extracted',
        data: {
          //name: avatar.name,
          //mimetype: avatar.mimetype,
          //size: avatar.size
        },
      }
    } catch (error) {
      logger.error(`Error: ${error.message}`);
      return {
        status: false,
        message: error.message,
      }
    }
  });
}

