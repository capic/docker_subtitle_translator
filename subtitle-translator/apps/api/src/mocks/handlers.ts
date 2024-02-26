import { http, HttpResponse } from 'msw';
import { searchPage } from './data/searchPage';
import { resultPage } from './data/resultPage';

export const handlers = [
  http.get(`https://www.addic7ed.com/srch.php`, () => {
    return new HttpResponse(searchPage);
  }),

 http.get(
    'https://www.addic7ed.com/serie/Evil/3/8/The_Demon_of_Parenthood',
    () => {
      return new HttpResponse(resultPage);
    },
  )
];
