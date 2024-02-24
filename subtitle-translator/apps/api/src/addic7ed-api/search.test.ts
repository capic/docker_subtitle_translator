import search from './search';
import { server } from '../../mocks/node';
import { http, HttpResponse } from 'msw';
import { emptyResultPage } from '../../mocks/data/emptyResultPage';

describe('search', () => {
  describe(
    'tv shows',
    () => {
      it('returns the subtitles', async () => {
        const expected = {
          downloadableSubtitles: [
            {
              distribution: 'WEB-DL',
              downloads: undefined,
              lang: 'English',
              link: '/original/176864/1',
              team: 'ION10+GGEZL-DVSUXL-GGEZ',
              version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
            },
            {
              distribution: 'WEB-DL',
              downloads: undefined,
              lang: 'English',
              link: '/original/176864/1',
              team: 'ION10+GGEZL-DVSUXL-GGEZ',
              version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
            },
            {
              distribution: 'WEB-DL',
              downloads: undefined,
              lang: 'English',
              link: '/original/176864/0',
              team: 'ION10+GGEZL-DVSUXL-GGEZ',
              version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
            },
            {
              distribution: 'WEB-DL',
              downloads: undefined,
              lang: 'English',
              link: '/original/176864/0',
              team: 'ION10+GGEZL-DVSUXL-GGEZ',
              version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
            },
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
            {
              distribution: 'WEB-DL',
              downloads: undefined,
              lang: 'Spanish (Spain)',
              link: '/original/176864/2',
              team: 'ION10+GGEZL-DVSUXL-GGEZ',
              version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
            },
            {
              distribution: 'WEB-DL',
              downloads: undefined,
              lang: 'Spanish (Spain)',
              link: '/original/176864/2',
              team: 'ION10+GGEZL-DVSUXL-GGEZ',
              version: 'ION10+GGEZ+WEBDL-DVSUX+WEBDL-GGEZ',
            },
          ],
          episodeTitle: 'The Demon of Parenthood Subtitle',
          referer: '/show/7414',
          showTitle: 'Evil',
        };
        expect(
          await search({ show: 'Evil', season: '3', episode: '8', languages: [] }),
        ).toStrictEqual(expected);
      });

      it('returns null if no result found', async () => {
        server.use(
          http.get(
            `https://www.addic7ed.com/srch.php`,
            () => {
              return new HttpResponse(emptyResultPage);
            },
          ),
        );
        expect(
          await search({ show: 'Evil', season: '03', episode: '08', languages: ['fre'] }),
        ).toBeNull();
      });

      it('returns null if no url', async () => {
        server.use(
          http.get(
            `https://www.addic7ed.com/srch.php`,
            () => {
              return new HttpResponse('');
            },
          ),
        );
        expect(
          await search({ show: 'Evil', season: '03', episode: '08', languages: ['fre'] }),
        ).toBeNull();
      });
    },
  );

  describe('movies', () => {
    it.todo('returns the subtitles');
    //it.todo('returns "result found" if results found')
    it.todo('returns null if no result found');
    it.todo('returns null if no url');
  });
});
