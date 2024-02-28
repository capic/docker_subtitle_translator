import { http, HttpResponse } from 'msw';
import { searchPage } from './data/searchPage';
import { resultPage } from './data/resultPage';
import { addic7edURL } from '../addic7ed-api/helpers';
import fs from 'fs';

export const handlers = [
  http.get(`${addic7edURL}/srch.php`, () => {
    return new HttpResponse(searchPage);
  }),

  http.get(
    `${addic7edURL}/serie/Evil/3/8/The_Demon_of_Parenthood`,
    () => {
      return new HttpResponse(resultPage);
    },
  ),

  http.get(`${addic7edURL}/file/subtitle`, () => {
    return new HttpResponse(/*fs.readFileSync('./sous-titres.mkv.fr.srt'), {
      headers: {
        'Content-Type': 'image/jpeg',
      }
    }*/)
  })
];
