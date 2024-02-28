import { Buffer } from 'buffer';
import fs from 'fs';
import iconv from 'iconv-lite';
import { addic7edURL } from './helpers';
import { SubInfo } from '@subtitle-translator/shared';
import axios from 'axios';

export default async function download(subInfo: SubInfo, filename: string) {
  const response = await axios.get(`${addic7edURL}${subInfo.link}`, {
    headers: {
      Referer: `${addic7edURL}${subInfo.referer || '/show/1'}`,
    },
    //follow: 0,
  });

  const fileContentBuffer = Buffer.from(response.data);
  let fileContent = iconv.decode(fileContentBuffer, 'utf8');

  if (~fileContent.indexOf('�')) {
    // File content seems badly encoded, try to decode again
    // -----------------------------------------------------
    fileContent = iconv.decode(fileContentBuffer, 'binary');
  }

  return new Promise((resolve) => {
    fs.writeFile(filename, fileContent, 'utf8', resolve);
  });
}
