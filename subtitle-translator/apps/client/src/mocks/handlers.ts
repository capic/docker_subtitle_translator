import { http, HttpResponse } from 'msw';

const json = {
  name: 'server',
  path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server',
  relativePath: '.',
  type: 'directory',
  isSymbolicLink: false,
  sizeInBytes: 6140,
  size: '6.14 KB',
  hash: '0b361cc76375a844c270123181764bb5',
  children: [
    {
      name: '.eslintrc.json',
      path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/.eslintrc.json',
      relativePath: '.eslintrc.json',
      type: 'file',
      isSymbolicLink: false,
      extension: 'json',
      sizeInBytes: 306,
      size: '306 B',
      hash: '5fb0cd02eb08ef73208d2b08d2b2ded6',
    },
    {
      name: 'jest.config.ts',
      path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/jest.config.ts',
      relativePath: 'jest.config.ts',
      type: 'file',
      isSymbolicLink: false,
      extension: 'ts',
      sizeInBytes: 323,
      size: '323 B',
      hash: '74f5a7e8903441d51fa91028259e7981',
    },
    {
      name: 'project.json',
      path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/project.json',
      relativePath: 'project.json',
      type: 'file',
      isSymbolicLink: false,
      extension: 'json',
      sizeInBytes: 1527,
      size: '1.53 KB',
      hash: 'fb4d88c6149a56fd79b60d1ed62a85d7',
    },
    {
      name: 'src',
      path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/src',
      relativePath: 'src',
      type: 'directory',
      isSymbolicLink: false,
      sizeInBytes: 2946,
      size: '2.95 KB',
      hash: '4e969075113401649b784a09d321f81a',
      children: [
        {
          name: 'assets',
          path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/src/assets',
          relativePath: 'src/assets',
          type: 'directory',
          isSymbolicLink: false,
          sizeInBytes: 0,
          size: '0 B',
          hash: 'c43403e5541956f1cf90fc555d9303c7',
          children: [
            {
              name: '.gitkeep',
              path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/src/assets/.gitkeep',
              relativePath: 'src/assets/.gitkeep',
              type: 'file',
              isSymbolicLink: false,
              extension: '',
              sizeInBytes: 0,
              size: '0 B',
              hash: '935bca95504baded4f683cd5db8a6ded',
            },
          ],
        },
        {
          name: 'main.ts',
          path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/src/main.ts',
          relativePath: 'src/main.ts',
          type: 'file',
          isSymbolicLink: false,
          extension: 'ts',
          sizeInBytes: 2946,
          size: '2.95 KB',
          hash: '114240e77fc85589c7b19c674a21afc1',
        },
      ],
    },
    {
      name: 'tsconfig.app.json',
      path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/tsconfig.app.json',
      relativePath: 'tsconfig.app.json',
      type: 'file',
      isSymbolicLink: false,
      extension: 'json',
      sizeInBytes: 261,
      size: '261 B',
      hash: 'e2e1f5389757b529ddb467dfdcbf582c',
    },
    {
      name: 'tsconfig.json',
      path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/tsconfig.json',
      relativePath: 'tsconfig.json',
      type: 'file',
      isSymbolicLink: false,
      extension: 'json',
      sizeInBytes: 253,
      size: '253 B',
      hash: '47dfcfc088f082759f71a13d812cc279',
    },
    {
      name: 'tsconfig.spec.json',
      path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/tsconfig.spec.json',
      relativePath: 'tsconfig.spec.json',
      type: 'file',
      isSymbolicLink: false,
      extension: 'json',
      sizeInBytes: 265,
      size: '265 B',
      hash: '1edf5402245e017dda3d3be238cdfe6f',
    },
    {
      name: 'webpack.config.js',
      path: '/home/capic/developpement/python/docker_subtitle_translator/subtitle-translator/apps/server/webpack.config.js',
      relativePath: 'webpack.config.js',
      type: 'file',
      isSymbolicLink: false,
      extension: 'js',
      sizeInBytes: 259,
      size: '259 B',
      hash: '0c3129b5a5ff97d1576b22ce2754376a',
    },
  ],
};
export const handlers = [
  http.get('http://192.168.1.106:3333/api/files', () => {
    return HttpResponse.json(json);
  }),
  http.post<{}, { filePath: string }>(
    'http://192.168.1.106:3333/api/translate',
    async ({ request }) => {
      const { filePath } = await request.json();

      console.log({ filePath });

      return new HttpResponse(null, { status: 201 });
    }
  ),
];
