import fetch from 'node-fetch';
import langs from 'langs';
import { addic7edURL, formatShowNumber, headers } from './helpers';
import logger from '../logger';

export default async function search({ show, season, episode, languages }: {show:string, season?:string, episode?:string, languages?: string[]}) {
  const searchTitle = `${show.trim()} ${season ? formatShowNumber(season) : ''} ${episode ? formatShowNumber(episode) : ''}`.trim();
  const addic7edSearchURL = `${addic7edURL}/srch.php?search=${searchTitle}&Submit=Search`

  logger.debug(`Search url: ${addic7edSearchURL}`)

  const response = await fetch(addic7edSearchURL, {headers});
    const body = await response.text();

    if (!/<b>\d+ results found<\/b>/.test(body)) {
      logger.debug(`Result found`)
        return findSubtitles({ body, languages })
    }

    if (~body.indexOf('<b>0 results found<\/b>')) {
      logger.debug(`No result`)
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
            ? 'href="(serie/[^/]+/' + parseInt(season) + '/' + parseInt(episode) + '/.+?)"'
            : 'href="(movie\/[0-9]+?)"'
    );

    const urlMatch = body.match(regexp);
    const url = urlMatch && urlMatch[1];

    if (!url) {
      logger.debug(`No url`)
        return [];
    }

    const otherSearchUrl = `${addic7edURL}/${url}`
    logger.debug(`Other search url: ${otherSearchUrl}`)
    const urlResponse = await fetch(otherSearchUrl, {headers});
    const urlBody = await urlResponse.text();
    return findSubtitles({ type: season ? 'tv' : 'movie', body: urlBody, languages });
}


function findSubtitles({ type, body, languages }: {type?: string, body: string, languages?: string[]}) {
    const regexpTitle = type === 'tv'
        ? /(.+?) - \d\dx\d\d - (.+?) <small/
        : /(.*?) \([0-9]{4}\) <small/;

    const subs = [],
        refererMatch = body.match(/\/show\/\d+/),
        referer = refererMatch ? refererMatch[0] : '/show/1',
        titleMatch = body.match(regexpTitle),
        episodeTitle = titleMatch ? titleMatch[2] : '',
        showTitle = titleMatch ? titleMatch[1].trim() : '',
        versionRegExp = /Version (.+?),([^]+?)<\/table/g,
        subInfoRegExp = /class="language">([^]+?)<a[^]+?(% )?Completed[^]+?href="([^"]+?)"><strong>(?:most updated|Download)[^]+?(\d+) Downloads/g;

    let versionMatch;

    // Find subtitles HTML block parts
    // ===============================
    while ((versionMatch = versionRegExp.exec(body)) !== null) {
        const version = versionMatch[1].toUpperCase();
        const hearingImpaired = versionMatch[2].indexOf('Hearing Impaired') !== -1;

        let subInfoMatch;
        while ((subInfoMatch = subInfoRegExp.exec(versionMatch[2])) !== null) {
            const notCompleted = subInfoMatch[2];
            if (notCompleted) {
                continue;
            }

            const lang = subInfoMatch[1];
            // Find lang iso code 2B
            // ---------------------
            const langIds = langs.where('name', lang.replace(/\(.+\)/g, '').trim());
            const langId = langIds && langIds['2B'] || lang.slice(0, 3).toLowerCase();

            if (languages && !~languages.indexOf(langId)) {
                continue;
            }

            const link = subInfoMatch[3];
            const downloads = parseInt(subInfoMatch[4], 10);

            const distributionMatch = version.match(/HDTV|WEB(.DL|.?RIP)?|WR|BRRIP|BDRIP|BLURAY/i);

            const distribution = distributionMatch
                ? distributionMatch[0].toUpperCase()
                    .replace(/WEB(.DL|.?RIP)?|WR/, 'WEB-DL')
                    .replace(/BRRIP|BDRIP|BLURAY/, 'BLURAY')
                : 'UNKNOWN';

            const team = version.replace(/.?(REPACK|PROPER|[XH].?264|HDTV|480P|720P|1080P|2160P|AMZN|WEB(.DL|.?RIP)?|WR|BRRIP|BDRIP|BLURAY)+.?/g, '')
                .trim().toUpperCase() || 'UNKNOWN';

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
