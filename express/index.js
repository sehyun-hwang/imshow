/* eslint-disable import/prefer-default-export */
import { createHash } from 'crypto';
import { buffer as stream2buffer } from 'stream/consumers';

import { Base64Encode } from 'base64-stream';
import { Router } from 'express';
import got from 'got';

const NGINX_PUB_URL = `http://${process.env.NGINX_HOST || 'stream'}/pub?id=imshow`;
console.log(NGINX_PUB_URL);

const postRequest = params => got.post(NGINX_PUB_URL, params);

let buffer;
let type;

export const router = Router()

  .get('/', (req, res) => {
    const frontendOrigin = req.get('X-Frontend-Origin');
    frontendOrigin ? res.redirect(frontendOrigin + '/imshow') : res.sendStatus(404);
  })

  .get('/last', (req, res) => (buffer ? res.type(type).send(buffer) : res.sendStatus(404)))

  .post(
    '/',
    (req, res) => {
      const _type = req.get('Content-Type');
      if (!req.is('image/*')) {
        const message = 'Bad Content-Type in imshow:' + _type;
        console.log(message);
        res.status(400).send(message);
        return;
      }

      const { date } = req.query;
      type = _type;
      stream2buffer(req).then(_buffer => buffer = _buffer);

      try {
        Promise.all([

            new Promise(resolve => {
              const hash = createHash('md5');
              req.on('data', hash.update.bind(hash))
                .on('end', () => resolve(hash.digest('hex')));
            }).then(async hash => {
              const json = { date, hash };
              console.log(json);
              postRequest({ json });
              return json;
            }),

            new Promise(resolve => req.pipe(new Base64Encode())
              .pipe(postRequest({ isStream: true }))
              .once('finish', resolve)),

          ])

          .then(([json]) => res.json(json))
          .catch(console.log);
      }
      catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    },
  );
