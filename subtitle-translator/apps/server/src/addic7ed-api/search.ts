import langs from 'langs';
import { addic7edURL, formatShowNumber, headers } from './helpers';
import logger from '../logger';
import axios from 'axios';
import { parse, HTMLElement } from 'node-html-parser';

export default async function search({
  show,
  season,
  episode,
  languages,
}: {
  show: string;
  season?: string;
  episode?: string;
  languages?: string[];
}) {
  const searchTitle =
    `${show.trim()} ${season ? formatShowNumber(season) : ''} ${episode ? formatShowNumber(episode) : ''}`.trim();
  const addic7edSearchURL = `${addic7edURL}/srch.php?search=${searchTitle}&Submit=Search`;

  logger.debug(`Search url: ${addic7edSearchURL}`);

  const response = await axios.get(addic7edSearchURL, { headers });
  const body = await response.data;

  if (!/<b>\d+ results found<\/b>/.test(body)) {
    logger.debug(`Result found`);
    return findSubtitles2({ body, languages });
  }

  if (~body.indexOf('<b>0 results found</b>')) {
    logger.debug(`No result`);
    // No results
    // ==========
    return [];
  }

  // Multiple results
  // ================

  // Find result with proper season and episode in url
  // -------------------------------------------------

  const regexp = new RegExp(
    season
      ? 'href="(serie/[^/]+/' +
        parseInt(season) +
        '/' +
        parseInt(episode) +
        '/.+?)"'
      : 'href="(movie/[0-9]+?)"',
  );

  const urlMatch = body.match(regexp);
  const url = urlMatch && urlMatch[1];

  if (!url) {
    logger.debug(`No url`);
    return [];
  }

  const otherSearchUrl = `${addic7edURL}/${url}`;
  logger.debug(`Other search url: ${otherSearchUrl}`);
  const urlResponse = await axios.get(otherSearchUrl, { headers });
  const urlBody = await urlResponse.data;
  return findSubtitles2({
    type: season ? 'tv' : 'movie',
    body: urlBody,
    languages,
  });
}

function getTitleInfo(dom: HTMLElement) {
  const title = dom.querySelector('span.titulo').text;
  const infoParsed = title.split(' - ');
  const episodeTitle = infoParsed[2].trim();
  const showTitle = infoParsed[0].trim();

  return { episodeTitle, showTitle };
}

function getVersionInfo(availableSubtitle: HTMLElement) {
  const version = availableSubtitle
    .querySelector('td.NewsTitle')
    .text.replace('Version ', '')
    .split(',')
    .at(0);

  const distributionMatch = version.match(
    /HDTV|WEB(.DL|.?RIP)?|WR|BRRIP|BDRIP|BLURAY/i,
  );

  const distribution = distributionMatch
    ? distributionMatch[0]
      .toUpperCase()
      .replace(/WEB(.DL|.?RIP)?|WR/, 'WEB-DL')
      .replace(/BRRIP|BDRIP|BLURAY/, 'BLURAY')
    : 'UNKNOWN';

  const team =
    version
      .replace(
        /.?(REPACK|PROPER|[XH].?264|HDTV|480P|720P|1080P|2160P|AMZN|WEB(.DL|.?RIP)?|WR|BRRIP|BDRIP|BLURAY)+.?/g,
        '',
      )
      .trim()
      .toUpperCase() || 'UNKNOWN';

  return {version, distribution, team}
}

function findSubtitles2({
  type,
  body,
  languages,
}: {
  type?: string;
  body: string;
  languages?: string[];
}) {
  const dom = parse(body);
  const { episodeTitle, showTitle } = getTitleInfo(dom);
  const referer = dom.getElementById('qsSeason').text

  const availableSubtitles = dom.querySelectorAll('table.tabel95:has(td.NewsTitle)');

  const downloadableSubtitles = availableSubtitles.map((availableSubtitle) => {
    const downloads = availableSubtitle.querySelector('td.newsDate:not(:has(img[src="https://www.addic7ed.com/images/invisible.gif"]))').text.split(' . ').at(1)
    const lang = availableSubtitle.querySelector('td.language').text.trim()
    const {team, version, distribution} = getVersionInfo(availableSubtitle)
    const link = availableSubtitle.querySelector('a.buttonDownload').getAttribute('href')

    return { episodeTitle, showTitle, version, downloads, lang, /*langId*/team, distribution, link, /*hearingImpaired*/ }
  });

 return {episodeTitle, showTitle, referer, ...downloadableSubtitles}
}

function findSubtitles({
  type,
  body,
  languages,
}: {
  type?: string;
  body: string;
  languages?: string[];
}) {
  const regexpTitle =
    type === 'tv'
      ? /(.+?) - \d\dx\d\d - (.+?) <small/
      : /(.*?) \([0-9]{4}\) <small/;

  const subs = [],
    refererMatch = body.match(/\/show\/\d+/),
    referer = refererMatch ? refererMatch[0] : '/show/1',
    titleMatch = body.match(regexpTitle),
    episodeTitle = titleMatch ? titleMatch[2] : '',
    showTitle = titleMatch ? titleMatch[1].trim() : '',
    versionRegExp = /Version (.+?),([^]+?)<\/table/g,
    subInfoRegExp =
      /class="language">([^]+?)<a[^]+?(% )?Completed[^]+?href="([^"]+?)"><strong>(?:most updated|Download)[^]+?(\d+) Downloads/g;

  let versionMatch;

  // Find subtitles HTML block parts
  // ===============================
  while ((versionMatch = versionRegExp.exec(body)) !== null) {
    const version = versionMatch[1].toUpperCase();
    const hearingImpaired = versionMatch[2].indexOf('Hearing Impaired') !== -1;

    console.log('versionMatch[2]', versionMatch[2]);
    let subInfoMatch;
    while ((subInfoMatch = subInfoRegExp.exec(versionMatch[2])) !== null) {
      const notCompleted = subInfoMatch[2];
      console.log({ notCompleted });
      if (notCompleted) {
        continue;
      }

      const lang = subInfoMatch[1];
      // Find lang iso code 2B
      // ---------------------
      const langIds = langs.where('name', lang.replace(/\(.+\)/g, '').trim());
      const langId =
        (langIds && langIds['2B']) || lang.slice(0, 3).toLowerCase();

      if (languages && !~languages.indexOf(langId)) {
        continue;
      }

      const link = subInfoMatch[3];
      const downloads = parseInt(subInfoMatch[4], 10);

      const distributionMatch = version.match(
        /HDTV|WEB(.DL|.?RIP)?|WR|BRRIP|BDRIP|BLURAY/i,
      );

      const distribution = distributionMatch
        ? distributionMatch[0]
            .toUpperCase()
            .replace(/WEB(.DL|.?RIP)?|WR/, 'WEB-DL')
            .replace(/BRRIP|BDRIP|BLURAY/, 'BLURAY')
        : 'UNKNOWN';

      const team =
        version
          .replace(
            /.?(REPACK|PROPER|[XH].?264|HDTV|480P|720P|1080P|2160P|AMZN|WEB(.DL|.?RIP)?|WR|BRRIP|BDRIP|BLURAY)+.?/g,
            '',
          )
          .trim()
          .toUpperCase() || 'UNKNOWN';

      console.log('push', {
        episodeTitle,
        showTitle,
        downloads,
        lang,
        langId,
        distribution,
        team,
        version,
        link,
        referer,
        hearingImpaired,
      });
      subs.push({
        episodeTitle,
        showTitle,
        downloads,
        lang,
        langId,
        distribution,
        team,
        version,
        link,
        referer,
        hearingImpaired,
      });
    }
  }

  return subs;
}
