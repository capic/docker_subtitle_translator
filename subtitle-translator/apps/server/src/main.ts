/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, { Response } from 'express';
import * as path from 'path';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { exec, execSync } from 'child_process';
import fs from 'fs';
import * as dree from 'dree';
import { SubtitleParser } from 'matroska-subtitles';
import { v4 as uuidv4 } from 'uuid';

const children: dree.Dree[] = [
  {
    name: 'Séries en cours',
    path: '/data/media/series_en_cours',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
    hash: '0'
  },
  {
    name: 'Films à regarder',
    path: '/data/media/films_a_regarder',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
    hash: '1'
  },
  {
    name: 'Séries VO',
    path: '/data/media/series_vo',
    // path: '/mnt/c/Users/Vincent/Downloads',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
    hash: '2'
  },
];

const directoryMap = new Map<string, dree.Dree>();
const fileMap = new Map<string, dree.Dree>();

const app = express();
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const fileCallback = function (file) {
  console.log(`add file to map`, {file})
  fileMap.set(file.hash, file);
};
const directoryCallback = function (directory) {
  console.log(`add directory to map`, {directory})
  directoryMap.set(directory.hash, directory);
};

app.get('/api/files', (req, res) => {
  const tree: dree.Dree = {
    name: 'root',
    path: '/',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
    children: children.map((item) =>
      dree.scan(
        item.path,
        {
          depth: 0,
          stat: false,
          symbolicLinks: false,
          followLinks: false,
          size: false,
          hash: true,
          showHidden: false,
          emptyDirectory: false,
          descendants: false,
          extensions: ['mkv'],
        },
        fileCallback,
        directoryCallback
      )
    ),
  };

  res.send(JSON.stringify(tree));
});

app.get('/api/directories/:hash/files', (req, res) => {
  const { hash } = req.params;

  const directory = directoryMap.get(hash);

  const tree: dree.Dree = dree.scan(directory.path, {
    depth: 1,
    stat: false,
    symbolicLinks: false,
    followLinks: false,
    size: false,
    hash: true,
    showHidden: false,
    emptyDirectory: false,
    descendants: false,
    extensions: ['mkv'],
  },
  fileCallback,
  directoryCallback);

  res.send(JSON.stringify(tree));
});

app.get('/api/files/:hash/subtitles', (req, res) => {
  const { hash } = req.params;

  if (!hash) {
    res.send({
      status: false,
      message: 'No file hash',
    });
  }

  const file = fileMap.get(hash);

  if (!file) {
    res.send({
      status: false,
      message: 'No file found',
    });
  }

  const parser = new SubtitleParser();
  parser.once('tracks', (tracks) => {
    res.send({
      status: true,
      message: 'Srt extracted',
      data: JSON.stringify(tracks),
    });
  });

  fs.createReadStream(file.path).pipe(parser);
});

app.post('/api/files/:hash/subtitles/:number/translate', (req, res) => {
  const { hash, number } = req.params;

  if (!hash || !number) {
    res.send({
      status: false,
      message: 'No file hash or track number',
    });
  }

  const file = fileMap.get(hash);

  if (!file) {
    res.send({
      status: false,
      message: 'No file path',
    });
  }

  exec(
    `mkvextract tracks "${file.path}" ${number}:"/data/temp/${path.basename(
      file.path
    )}.srt"`,
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err);
      } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        /* fs.copyFileSync(`/data/temp/${path.basename(filePath)}.srt`,
        `/data/input/${path.basename(filePath)}.srt`) */
        exec(
          `subtrans translate "/data/temp/${path.basename(
            file.path
          )}.srt" --src en --dest fr`,
          (err, stdout, stderr) => {
            fs.rmSync(`/data/temp/${path.basename(file.path)}.srt`);
          }
        );
      }
    }
  );

  res.send({
    status: true,
    message: 'Srt extracted',
    data: {
      //name: avatar.name,
      //mimetype: avatar.mimetype,
      //size: avatar.size
    },
  });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
