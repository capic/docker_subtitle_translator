import search from './search';
import { server } from '../mocks/node';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('addic7ed-api', () => {
  it('', async () => {
    const res = await search({
      show: 'Evil',
      season: '03',
      episode: '08',
      languages: ['french'],
    });
    console.log({ res });
  });
});
