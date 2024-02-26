import { ModifiedDree } from '@subtitle-translator/shared';
import * as dree from 'dree'
import { Type } from 'dree';

export const root: ModifiedDree<dree.Dree> =  {
  name: 'root',
  path: '/',
  type: Type.DIRECTORY,
  relativePath: '.',
  isSymbolicLink: false,
  uuid: '_0',
  children: [
    {
      name: 'directory_0_1',
      path: '/directory_0_1',
      relativePath: '.',
      type: Type.DIRECTORY,
      isSymbolicLink: false,
      sizeInBytes: 383100360543,
      uuid: '_0_1',
    },
    {
      name: 'file_0+1.mkv',
      path: 'file_0+1.mkv',
      relativePath: 'file_0+1.mkv',
      type: Type.FILE,
      isSymbolicLink: false,
      extension: 'mkv',
      sizeInBytes: 267802658,
      uuid: '_0+1',
    },
    {
      name: 'file_0+2',
      path: '/file_0+2.mkv',
      relativePath: 'file_0+2.mkv',
      type: Type.FILE,
      isSymbolicLink: false,
      extension: 'mkv',
      sizeInBytes: 308738316,
      uuid: '_0+2',
    },
  ],
}


