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
  },
  {
    name: 'Films à regarder',
    path: '/data/media/films_a_regarder',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
  },
  {
    name: 'Séries VO',
    path: '/data/media/series_vo',
    //path: '/mnt/c/Users/Vincent/Downloads',
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
  },
];

const findFileByHash = (children: dree.Dree[], hash: string) => {
  let filePath = null;
  children.map((item) =>
    dree.scan(
      item.path,
      {
        //depth: 2,
        stat: false,
        symbolicLinks: false,
        followLinks: false,
        size: false,
        hash: false,
        showHidden: false,
        emptyDirectory: false,
        descendants: false,
        extensions: ['mkv'],
      },
      (element, stat) => {
        if (element.hash === hash) {
          filePath = element.path;
        }
      }
    )
  );

  return filePath;
};

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

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

const fileCallback = function (file) {
  fileMap.set(file.hash, file);
};
const directoryCallback = function (directory) {
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
        directoryCallback
      )
    ),
  };

  res.send(JSON.stringify(tree));
});

app.get('/api/directory/:hash/files', (req, res) => {
  const { hash } = req.params;
  
  const tree: dree.Dree = {
    name: 'root',
    path: directoryMap.get(hash)?.path,
    type: dree.Type.DIRECTORY,
    relativePath: '.',
    isSymbolicLink: false,
    children: children.map(
      (item) =>
        dree.scan(
          item.path,
          {
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
          (file) => fileMap.set(file.hash, file)
        ),
      (directory) => directoryMap.set(directory.hash, directory)
    ),
  };

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

  const filePath = findFileByHash(children, hash);

  if (!filePath) {
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

  fs.createReadStream(filePath).pipe(parser);
});

app.post('/api/files/:hash/subtitles/:number/translate', (req, res) => {
  const { hash, number } = req.params;

  if (!hash || !number) {
    res.send({
      status: false,
      message: 'No file hash or track number',
    });
  }

  const filePath = findFileByHash(children, hash);

  if (!filePath) {
    res.send({
      status: false,
      message: 'No file path',
    });
  }

  exec(
    `mkvextract tracks "${filePath}" ${number}:"/data/temp/${path.basename(
      filePath
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
            filePath
          )}.srt" --src en --dest fr`,
          (err, stdout, stderr) => {
            fs.rmSync(`/data/temp/${path.basename(filePath)}.srt`);
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

app.post('/api', (req, res) => {
  const moveFile = (file: fileUpload.UploadedFile) => {
    //Use the mv() method to place the file in the upload directory (i.e. "uploads")
    file.mv('/data/temp/' + file.name);
    console.error('File uploaded');
    exec(
      `mkvextract tracks /data/temp/${file.name} 2:/data/input/${file.name}.srt`,
      (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err);
          fs.unlinkSync(`/data/temp/${file.name}`);
        } else {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);

          fs.unlinkSync(`/data/temp/${file.name}`);
        }
      }
    );

    //send response
    res.send({
      status: true,
      message: 'File is uploaded',
      data: {
        //name: avatar.name,
        //mimetype: avatar.mimetype,
        //size: avatar.size
      },
    });
  };

  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let file = req.files.file;
      if (Array.isArray(file)) {
        file.forEach((f) => moveFile(f));
      } else {
        moveFile(file);
      }
    }
  } catch (err) {
    console.log({ err });
    res.status(500).send(err);
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
