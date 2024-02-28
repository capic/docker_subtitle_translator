import download from './download';
import fs from 'fs';

describe.skip('download', () => {
  const filePath = '../mocks/temp/expected.srt'

  beforeEach(() => {
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath);
    }
  })

  it('downloads the file', async () => {
    await download({link: '/file/subtitle', referer: 'a'}, filePath)

    expect(fs.readFileSync(filePath)).toEqual(fs.readFileSync('../mocks/sous-titres.mkv.fr.srt'))
  });
  it.todo('downloads the file if bad encoding');
});
