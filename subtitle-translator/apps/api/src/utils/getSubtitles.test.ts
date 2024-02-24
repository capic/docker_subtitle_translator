import {
  getSubtitlesFromAddic7ed,
  getSubtitlesFromDirectory,
  getSubtitlesFromFile,
} from './getSubtitles';
import * as dree from 'dree';
import { Type } from 'dree';
import fs from 'fs';
import { ModifiedDree } from '@subtitle-translator/shared';

describe('getSubtitles', () => {
  describe('getSubtitlesFromFile', () => {
    it('returns the subtitles', async () => {
      const file: ModifiedDree<dree.Dree> = {
        name: 'test5.mkv',
        path: 'apps/api/mocks/test5.mkv',
        relativePath: '../../test5.mkv',
        type: Type.FILE,
        isSymbolicLink: false,
        extension: 'mkv',
        sizeInBytes: 1822536247,
        uuid: 'dfc8745b-72ca-4bd5-9009-668e85cd4118',
      };

      expect(await getSubtitlesFromFile(file)).toStrictEqual([
        { number: 3, language: undefined, type: 'utf8', origin: 'Internal' },
        { number: 4, language: 'hun', type: 'utf8', origin: 'Internal' },
        { number: 5, language: 'ger', type: 'utf8', origin: 'Internal' },
        { number: 6, language: 'fre', type: 'utf8', origin: 'Internal' },
        { number: 8, language: 'spa', type: 'utf8', origin: 'Internal' },
        { number: 9, language: 'ita', type: 'utf8', origin: 'Internal' },
        { number: 11, language: 'jpn', type: 'utf8', origin: 'Internal' },
        { number: 7, language: 'und', type: 'utf8', origin: 'Internal' },
      ]);
    });
    it('returns empty array if no subtitles', async() => {
      const file: ModifiedDree<dree.Dree> = {
        name: 'test5 sans sous titre.mkv',
        path: 'apps/api/mocks/test5 sans sous titre.mkv',
        relativePath: '../../test5 sans sous titre.mkv',
        type: Type.FILE,
        isSymbolicLink: false,
        extension: 'mkv',
        sizeInBytes: 1822536247,
        uuid: 'dfc8745b-72ca-4bd5-9009-668e85cd4118',
      };

      expect(await getSubtitlesFromFile(file)).toStrictEqual([]);
    });
  });

  describe('getSubtitlesFromDirectory', () => {
    it('returns the subtitles', () => {
      const file: ModifiedDree<dree.Dree> = {
        name: 'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        relativePath:
          'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        type: Type.FILE,
        isSymbolicLink: false,
        extension: 'mkv',
        sizeInBytes: 1822536247,
        uuid: 'dfc8745b-72ca-4bd5-9009-668e85cd4118',
      };

      jest.spyOn(fs, 'readdirSync').mockReturnValue([
        //@ts-expect-error string
        'fake1.srt',
        //@ts-expect-error string
        'fake2.srt',
        //@ts-expect-error string
        'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv.fr.srt',
      ]);

      expect(getSubtitlesFromDirectory(file)).toStrictEqual([
        {
          language: 'fr',
          name: 'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv.fr.srt',
          origin: 'External',
        },
      ]);
    });
    it('is not sensitive', () => {
      const file: ModifiedDree<dree.Dree> = {
        name: 'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        relativePath:
          'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        type: Type.FILE,
        isSymbolicLink: false,
        extension: 'mkv',
        sizeInBytes: 1822536247,
        uuid: 'dfc8745b-72ca-4bd5-9009-668e85cd4118',
      };

      jest.spyOn(fs, 'readdirSync').mockReturnValue([
        //@ts-expect-error string
        'fake1.srt',
        //@ts-expect-error string
        'fake2.srt',
        //@ts-expect-error string
        'DDLValley.me_83_A.Murder.at.the.End.of.the.World.s01e05.1080p.WEB.h264-ETHEL.mkv.fr.srt',
      ]);

      expect(getSubtitlesFromDirectory(file)).toStrictEqual([
        {
          language: 'fr',
          name: 'DDLValley.me_83_A.Murder.at.the.End.of.the.World.s01e05.1080p.WEB.h264-ETHEL.mkv.fr.srt',
          origin: 'External',
        },
      ]);
    });
    it('returns empty array if no subtitles', () => {
      const file: ModifiedDree<dree.Dree> = {
        name: 'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        path: '/data/media/series_en_cours/A Murder at The End of The Day/DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        relativePath:
          'DDLValley.me_83_A.Murder.at.the.End.of.the.World.S01E05.1080p.WEB.h264-ETHEL.mkv',
        type: Type.FILE,
        isSymbolicLink: false,
        extension: 'mkv',
        sizeInBytes: 1822536247,
        uuid: 'dfc8745b-72ca-4bd5-9009-668e85cd4118',
      };

      jest.spyOn(fs, 'readdirSync').mockReturnValue([]);

      expect(getSubtitlesFromDirectory(file)).toStrictEqual([]);
    });
  });

  describe('getSubtitlesFromAddic7ed', () => {
    it('returns the subtitles', async () => {
      const file: ModifiedDree<dree.Dree> = {
        name: 'DDLValley.me_83_A.Evil.S03E08.1080p.WEB.h264-ETHEL.mkv',
        path: '/data/media/series_en_cours/Evil/DDLValley.me_83_A.Evil.S03E08.1080p.WEB.h264-ETHEL.mkv',
        relativePath: 'DDLValley.me_83_A.Evil.S03E08.1080p.WEB.h264-ETHEL.mkv',
        type: Type.FILE,
        isSymbolicLink: false,
        extension: 'mkv',
        sizeInBytes: 1822536247,
        uuid: 'dfc8745b-72ca-4bd5-9009-668e85cd4118',
      };

      expect(await getSubtitlesFromAddic7ed(file)).toEqual([
        {
          downloadUrl: '/original/176864/1',
          language: 'fr',
          name: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          origin: 'Addic7ed',
        },
        {
          downloadUrl: '/original/176864/1',
          language: 'fr',
          name: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          origin: 'Addic7ed',
        },
        {
          downloadUrl: '/original/176864/0',
          language: 'fr',
          name: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          origin: 'Addic7ed',
        },
        {
          downloadUrl: '/original/176864/0',
          language: 'fr',
          name: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          origin: 'Addic7ed',
        },
        {
          downloadUrl: '/original/176864/3',
          language: 'fr',

          name: 'ION10+GLHF+GGEZ+AMZN-WEBRip+WEBDL',
          origin: 'Addic7ed',
        },
        {
          downloadUrl: '/original/176864/3',
          language: 'fr',
          name: 'ION10+GLHF+GGEZ+AMZN-WEBRip+WEBDL',
          origin: 'Addic7ed',
        },
        {
          downloadUrl: '/original/176864/2',
          language: 'fr',
          name: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          origin: 'Addic7ed',
        },
        {
          downloadUrl: '/original/176864/2',
          language: 'fr',
          name: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          origin: 'Addic7ed',
        },
      ]);
    });
    it.todo('returns empty array if no subtitles');
    it.todo('returns empty array if addic7ed raises an error');
  });
});
