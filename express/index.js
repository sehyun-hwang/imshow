import { userInfo as getUserInfo } from "os";
import { createHash } from 'crypto';
import { buffer as stream2buffer } from 'stream/consumers';

import { Router } from 'express';
import got from 'got';
import { Base64Encode } from 'base64-stream';

const { uid } = getUserInfo();
const NGINX_PUB_URL = `http://${uid?'localhost:8081':'stream'}/pub?id=imshow`;
console.log(NGINX_PUB_URL);

const postRequest = params => got.post(NGINX_PUB_URL, params);

let buffer, type;

export const router = Router()

    .get('/', (req, res) => import('utils')
        .then(({ MyURL }) => res.redirect('/imshow'))
        .catch(error => {
            console.log(error);
            res.status(404).json(error);
        }))

    .get('/last', (req, res) => buffer ? res.type(type).send(buffer) : res.sendStatus(404))

    .post('/',
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
        });



import('utils')
    .then(({ IsMain }) => {
        if (!IsMain(
                import.meta.url))
            return;

    })
    .catch(console.log);
