import search from './search';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/node';
import { emptyResultPage } from '../mocks/data/emptyResultPage';

describe('search', () => {
  describe('tv shows', () => {
    it('returns the subtitles', async () => {
      const expected = {
        downloadableSubtitles: [
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            lang: 'French',
            link: '/original/176864/3',
            team: 'ION10+GLHF+GGEZIPL',
            version: 'ION10+GLHF+GGEZ+AMZN-WEBRip+WEBDL',
          },
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            lang: 'French',
            link: '/original/176864/3',
            team: 'ION10+GLHF+GGEZIPL',
            version: 'ION10+GLHF+GGEZ+AMZN-WEBRip+WEBDL',
          },
        ],
        episodeTitle: 'The Demon of Parenthood Subtitle',
        referer: '/show/7414',
        showTitle: 'Evil',
      };
      expect(
        await search({
          show: 'Evil',
          season: '3',
          episode: '8',
          languages: ['french'],
        }),
      ).toStrictEqual(expected);
    });

    it('returns null if no result found', async () => {
      server.use(
        http.get(`https://www.addic7ed.com/srch.php`, () => {
          return new HttpResponse(emptyResultPage);
        }),
      );
      expect(
        await search({
          show: 'Evil',
          season: '03',
          episode: '08',
          languages: ['french'],
        }),
      ).toBeNull();
    });

    it('returns null if no url', async () => {
      server.use(
        http.get(`https://www.addic7ed.com/srch.php`, () => {
          return new HttpResponse('');
        }),
      );
      expect(
        await search({
          show: 'Evil',
          season: '03',
          episode: '08',
          languages: ['french'],
        }),
      ).toBeNull();
    });
  });

  describe('movies', () => {
    it.todo('returns the subtitles');
    //it.todo('returns "result found" if results found')
    it.todo('returns null if no result found');
    it.todo('returns null if no url');
  });
});
