import search from './search';
import { server } from '../mocks/node';
import { http, HttpResponse } from 'msw';
import { emptyResultPage } from '../mocks/data';

describe('search', () => {
  describe('tv shows', () => {
    it('returns the subtitles', async () => {
      const expected = {
        downloadableSubtitles: [
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            episodeTitle: 'The Demon of Parenthood Subtitle',
            lang: 'English',
            link: '/original/176864/1',
            showTitle: 'Evil',
            team: 'ION10+GGEZL-DVSUXL-GGEZ',
            version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          },
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            episodeTitle: 'The Demon of Parenthood Subtitle',
            lang: 'English',
            link: '/original/176864/1',
            showTitle: 'Evil',
            team: 'ION10+GGEZL-DVSUXL-GGEZ',
            version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          },
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            episodeTitle: 'The Demon of Parenthood Subtitle',
            lang: 'English',
            link: '/original/176864/0',
            showTitle: 'Evil',
            team: 'ION10+GGEZL-DVSUXL-GGEZ',
            version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          },
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            episodeTitle: 'The Demon of Parenthood Subtitle',
            lang: 'English',
            link: '/original/176864/0',
            showTitle: 'Evil',
            team: 'ION10+GGEZL-DVSUXL-GGEZ',
            version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          },
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            episodeTitle: 'The Demon of Parenthood Subtitle',
            lang: 'French',
            link: '/original/176864/3',
            showTitle: 'Evil',
            team: 'ION10+GLHF+GGEZIPL',
            version: 'ION10+GLHF+GGEZ+AMZN-WEBRip+WEBDL',
          },
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            episodeTitle: 'The Demon of Parenthood Subtitle',
            lang: 'French',
            link: '/original/176864/3',
            showTitle: 'Evil',
            team: 'ION10+GLHF+GGEZIPL',
            version: 'ION10+GLHF+GGEZ+AMZN-WEBRip+WEBDL',
          },
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            episodeTitle: 'The Demon of Parenthood Subtitle',
            lang: 'Spanish (Spain)',
            link: '/original/176864/2',
            showTitle: 'Evil',
            team: 'ION10+GGEZL-DVSUXL-GGEZ',
            version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          },
          {
            distribution: 'WEB-DL',
            downloads: undefined,
            episodeTitle: 'The Demon of Parenthood Subtitle',
            lang: 'Spanish (Spain)',
            link: '/original/176864/2',
            showTitle: 'Evil',
            team: 'ION10+GGEZL-DVSUXL-GGEZ',
            version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
          },
        ],
        episodeTitle: 'The Demon of Parenthood Subtitle',
        referer: '/show/7414',
        showTitle: 'Evil',
      };
      expect(
        await search({ show: '', season: '', episode: '', languages: [] }),
      ).toStrictEqual(expected);
    });
    //it.todo('returns "result found" if results found')
    it('returns null if no result found', async () => {
      server.use(
        http.get(
          `https://www.addic7ed.com/serie/Evil/3/8/The_Demon_of_Parenthood`,
          () => {
            return new HttpResponse(emptyResultPage);
          },
        ),
      );
      const expected = {
        episodeTitle: 'The Demon of Parenthood Subtitle',
        referer: '/show/7414',
        showTitle: 'Evil',
        downloadableSubtitles: [],
      };
      expect(
        await search({ show: '', season: '', episode: '', languages: [] }),
      ).toStrictEqual(expected);
    });
    it.todo('returns null if no url');
  });

  describe('movies', () => {
    it.todo('returns the subtitles');
    //it.todo('returns "result found" if results found')
    it.todo('returns null if no result found');
    it.todo('returns null if no url');
  });
});
