import Fastify, { FastifyInstance } from 'fastify';
import { app } from './app';
import * as dree from 'dree';
import { Type } from 'dree';
import * as root from './routes/root';
import * as getSubtitles from '../getSubtitles';

describe('app', () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = Fastify();
    server.register(app);
  });

  describe('/api/files', () => {
    it('responds with 200', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/files',
      });

      expect(response.statusCode).toEqual(200);
    });
    it('returns the directories', async () => {
      const child1 = {
        name: 'series_en_cours',
        path: '/data/media/series_en_cours',
        relativePath: '.',
        type: Type.DIRECTORY,
        isSymbolicLink: false,
        sizeInBytes: 0,
        // @ts-ignore
        uuid: 'c1d1a886-fa2e-4238-b85b-425b3ff12109',
      };
      const child2 = {
        name: 'films_a_regarder',
        path: '/data/media/films_a_regarder',
        relativePath: '.',
        type: Type.DIRECTORY,
        isSymbolicLink: false,
        sizeInBytes: 0,
        // @ts-ignore
        uuid: '1800a8ff-e810-43e3-a1c4-7b52358718eb',
      };
      const child3 = {
        name: 'series_vo',
        path: '/data/media/series_vo',
        relativePath: '.',
        type: Type.DIRECTORY,
        isSymbolicLink: false,
        sizeInBytes: 0,
        // @ts-ignore
        uuid: '616d7b98-afd5-4708-b265-54cba336a9a9',
      };

      const result: dree.Dree = {
        name: 'root',
        path: '/',
        type: Type.DIRECTORY,
        relativePath: '.',
        isSymbolicLink: false,
        children: [child1, child2, child3],
      };
      jest.spyOn(dree, 'scan').mockReturnValueOnce(child1);
      jest.spyOn(dree, 'scan').mockReturnValueOnce(child2);
      jest.spyOn(dree, 'scan').mockReturnValueOnce(child3);

      const response = await server.inject({
        method: 'GET',
        url: '/api/files',
      });

      expect(response.json()).toEqual(result);
    });
  });

  describe('/api/directories/:uuid/files', () => {
    describe('no uuid', () => {
      it.skip('returns an error message', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/api/directories/:uuid/files',
        });

        expect(response.json()).toEqual({
          status: false,
          message: 'No file uuid',
        });
      });
      it.todo('returns an error code');
    });
    describe('no directory found', () => {
      it.todo('returns an error message');
      it.todo('returns an error code');
    });
    describe('ok', () => {
      const filesInDirectory: dree.Dree = {
        name: 'A Murder at The End of The Day',
        path: '/data/media/series_en_cours/A Murder at The End of The Day',
        relativePath: '.',
        type: Type.DIRECTORY,
        isSymbolicLink: false,
        sizeInBytes: 10259877909,
        children: [
          {
            name: 'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
            path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
            relativePath:
              'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
            type: Type.FILE,
            isSymbolicLink: false,
            extension: 'mkv',
            sizeInBytes: 1822536247,
            //@ts-ignore
            uuid: 'dfc8745b-72ca-4bd5-9009-668e85cd4118',
          },
          {
            name: 'DDLValley.me_A.MRDR.at.the.End.of.the.World.S01E01.1080p.WEB.h264-ETHEL.mkv',
            path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_A.MRDR.at.the.End.of.the.World.S01E01.1080p.WEB.h264-ETHEL.mkv',
            relativePath:
              'DDLValley.me_A.MRDR.at.the.End.of.the.World.S01E01.1080p.WEB.h264-ETHEL.mkv',
            type: Type.FILE,
            isSymbolicLink: false,
            extension: 'mkv',
            sizeInBytes: 1590857728,
            //@ts-ignore
            uuid: '7f75f1ca-e440-48a7-8675-2cc20cbfbb40',
          },
          {
            name: 'DDLValley.me_A.MRDR.at.the.End.of.the.World.S01E03.1080p.WEB.h264-ETHEL.mkv',
            path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_A.MRDR.at.the.End.of.the.World.S01E03.1080p.WEB.h264-ETHEL.mkv',
            relativePath:
              'DDLValley.me_A.MRDR.at.the.End.of.the.World.S01E03.1080p.WEB.h264-ETHEL.mkv',
            type: Type.FILE,
            isSymbolicLink: false,
            extension: 'mkv',
            sizeInBytes: 1609846931,
            //@ts-ignore
            uuid: '4eb634f2-229a-4084-a33a-431db7805a15',
          },
          {
            name: 'DDLValley.me_A.MRDR.at.the.end.of.the.world.s01e02.1080p.web.h264-successfulcrab.mkv',
            path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_A.MRDR.at.the.end.of.the.world.s01e02.1080p.web.h264-successfulcrab.mkv',
            relativePath:
              'DDLValley.me_A.MRDR.at.the.end.of.the.world.s01e02.1080p.web.h264-successfulcrab.mkv',
            type: Type.FILE,
            isSymbolicLink: false,
            extension: 'mkv',
            sizeInBytes: 1580743882,
            //@ts-ignore
            uuid: 'c28127f9-514a-4ed2-8008-515b5f47993f',
          },
          {
            name: 'DDLValley.me_A.Mrder.at.th.END.of.the.world.s01e07.1080p.web.h264-successfulcrab.mkv',
            path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_A.Mrder.at.th.END.of.the.world.s01e07.1080p.web.h264-successfulcrab.mkv',
            relativePath:
              'DDLValley.me_A.Mrder.at.th.END.of.the.world.s01e07.1080p.web.h264-successfulcrab.mkv',
            type: Type.FILE,
            isSymbolicLink: false,
            extension: 'mkv',
            sizeInBytes: 1071350864,
            //@ts-ignore
            uuid: 'd4096574-5cf8-4cb4-9dba-d0268f35341a',
          },
          {
            name: 'DDLValley.me_A.Murder.at.the.End.of.the.World.S01E04.1080p.WEB.h264-ETHEL.mkv',
            path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_A.Murder.at.the.End.of.the.World.S01E04.1080p.WEB.h264-ETHEL.mkv',
            relativePath:
              'DDLValley.me_A.Murder.at.the.End.of.the.World.S01E04.1080p.WEB.h264-ETHEL.mkv',
            type: Type.FILE,
            isSymbolicLink: false,
            extension: 'mkv',
            sizeInBytes: 1530119122,
            //@ts-ignore
            uuid: '040df02b-dcbd-4f78-a59b-77804999372d',
          },
          {
            name: 'DDLValley.me_a.MRDR.at.the.end.of.the.world.s01e06.1080p.web.h264-successfulcrab.mkv',
            path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_a.MRDR.at.the.end.of.the.world.s01e06.1080p.web.h264-successfulcrab.mkv',
            relativePath:
              'DDLValley.me_a.MRDR.at.the.end.of.the.world.s01e06.1080p.web.h264-successfulcrab.mkv',
            type: Type.FILE,
            isSymbolicLink: false,
            extension: 'mkv',
            sizeInBytes: 1054423135,
            //@ts-ignore
            uuid: '91d54e6c-ed51-4025-bf9d-fa9b3ca0ae61',
          },
        ],
        uuid: '96b3ebe4-4dd0-4ac9-8d17-d5a336aaca61',
      };

      beforeEach(() => {
        const directory: dree.Dree & { uuid: string } = {
          name: 'A Murder at The End of The Day',
          path: '/data/media/series_en_cours/A Murder at The End of The Day',
          relativePath: 'A Murder at The End of The Day',
          type: Type.DIRECTORY,
          isSymbolicLink: false,
          sizeInBytes: 0,
          uuid: 'f7642e4c-36a1-446c-8c26-a99aa8c660db',
        };
        jest.replaceProperty(root, 'directoryMap', new Map([['1', directory]]));
        jest.spyOn(dree, 'scan').mockReturnValueOnce(filesInDirectory);
      });

      it('responds with 200', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/api/directories/1/files',
        });

        expect(response.statusCode).toEqual(200);
      });

      it('returns the files and director of the directory', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/api/directories/1/files',
        });

        expect(response.json()).toStrictEqual(filesInDirectory);
      });
    });
  });

  describe('/api/files/:uuid/subtitles', () => {
    describe('no uuid', () => {
      it.todo('returns an error message');
      it.todo('returns an error code');
    });
    describe('no file found', () => {
      it.todo('returns an error message');
      it.todo('returns an error code');
    });

    describe('ok', () => {
      const subtitlesFromDirectory = [{ name: 'External', language: 'fr' }];
      const subtitlesFromFile = [
        { language: 'fr', name: 'sous titre français' },
      ];
      const subtitlesFromAddic7ed = [
        {
          language: 'fr',
          name: 'sous titre français addic7ed',
          downloadUrl: 'http://fake.com',
        },
      ];
      beforeEach(() => {
        const file: dree.Dree = {
            name: 'DDLValley.me_a.MRDR.at.the.end.of.the.world.s01e06.1080p.web.h264-successfulcrab.mkv',
            path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_a.MRDR.at.the.end.of.the.world.s01e06.1080p.web.h264-successfulcrab.mkv',
            relativePath:
              'DDLValley.me_a.MRDR.at.the.end.of.the.world.s01e06.1080p.web.h264-successfulcrab.mkv',
            type: Type.FILE,
            isSymbolicLink: false,
            extension: 'mkv',
            sizeInBytes: 1054423135,
            //@ts-ignore
            uuid: '91d54e6c-ed51-4025-bf9d-fa9b3ca0ae61',
          }
        jest.replaceProperty(root, 'fileMap', new Map([['1', file]]));
        jest
          .spyOn(getSubtitles, 'getSubtitlesFromDirectory')
          .mockReturnValueOnce(subtitlesFromDirectory);
        jest
          .spyOn(getSubtitles, 'getSubtitlesFromFile')
          .mockResolvedValue(subtitlesFromFile);
        jest
          .spyOn(getSubtitles, 'getSubtitlesFromAddic7ed')
          .mockResolvedValue(subtitlesFromAddic7ed);
      });

      it('responds with 200', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/api/files/1/subtitles',
        });

        expect(response.statusCode).toEqual(200);
      });
      it('returns the subtitles', async () => {
        const response = await server.inject({
          method: 'GET',
          url: '/api/files/1/subtitles',
        });

        expect(response.json()).toEqual([
          ...subtitlesFromDirectory,
          ...subtitlesFromFile,
          ...subtitlesFromAddic7ed,
        ]);
      });
    });
  });

  describe('/api/subtitles/translate', () => {
    describe('no uuid', () => {
      it.todo('returns an error message');
      it.todo('returns an error code');
    });
    describe('no number', () => {
      it.todo('returns an error message');
      it.todo('returns an error code');
    });
    describe('no file found', () => {
      it.todo('returns an error message');
      it.todo('returns an error code');
    });

    it.todo('translates the subtitle');
  });
});
