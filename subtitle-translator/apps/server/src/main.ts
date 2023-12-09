/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express, {Response} from 'express';
import * as path from 'path';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import { exec } from 'child_process'

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

app.post('/api', (req, res) => {
  const moveFile = (file: fileUpload.UploadedFile) => {
    //Use the mv() method to place the file in the upload directory (i.e. "uploads")
    file.mv('/home/capic/docker/translator_watcher/data/temp/' + file.name);
    console.error('File uploaded')
    exec(`cd /home/capic/docker/translator_watcher/data/temp/ && mkvextract tracks ${file.name} 2:${file.name}.srt`, (err, stdout, stderr) => {
    if (err) {
      //some err occurred
      console.error(err)
    } else {
     // the *entire* stdout and stderr (buffered)
     console.log(`stdout: ${stdout}`);
     console.log(`stderr: ${stderr}`);
    }
  })

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
        file.forEach((f) => moveFile(f))
      } else {
        moveFile(file)
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
