import {
  getSubtitlesFromAddic7ed,
  getSubtitlesFromDirectory,
  getSubtitlesFromFile,
} from './getSubtitles';
import * as dree from 'dree';
import { Type } from 'dree';
import fs from 'fs';

describe('getSubtitles', () => {
  describe.skip('getSubtitlesFromFile', () => {
    it('returns the subtitles', () => {
      const file: dree.Dree = {
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
      };

      expect(getSubtitlesFromFile(file)).toStrictEqual([]);
    });
    it('returns empty array if no subtitles', () => {
      const file: dree.Dree = {
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
      };

      expect(getSubtitlesFromFile(file)).toStrictEqual([]);
    });
  });

  describe('getSubtitlesFromDirectory', () => {
    it('returns the subtitles', () => {
      const file: dree.Dree = {
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
      };

      jest.spyOn(fs, 'readdirSync').mockReturnValue([
        //@ts-ignore
        'fake1.srt',
        //@ts-ignore
        'fake2.srt',
        //@ts-ignore
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
      const file: dree.Dree = {
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
      };

      jest.spyOn(fs, 'readdirSync').mockReturnValue([
        //@ts-ignore
        'fake1.srt',
        //@ts-ignore
        'fake2.srt',
        //@ts-ignore
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
      const file: dree.Dree = {
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
      };

      jest.spyOn(fs, 'readdirSync').mockReturnValue([]);

      expect(getSubtitlesFromDirectory(file)).toStrictEqual([]);
    });
  });

  describe('getSubtitlesFromAddic7ed', () => {
    it('returns the subtitles', async () => {
      const file: dree.Dree = {
        name: 'DDLValley.me_83_A.Evil.S03E08.1080p.WEB.h264-ETHEL.mkv',
        path: '/data/media/series_en_cours/Evil/DDLValley.me_83_A.Evil.S03E08.1080p.WEB.h264-ETHEL.mkv',
        relativePath: 'DDLValley.me_83_A.Evil.S03E08.1080p.WEB.h264-ETHEL.mkv',
        type: Type.FILE,
        isSymbolicLink: false,
        extension: 'mkv',
        sizeInBytes: 1822536247,
        //@ts-ignore
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
