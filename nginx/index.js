import WebSocket from 'https://cdn.jsdelivr.net/npm/reconnecting-websocket@4.4.0/dist/reconnecting-websocket.mjs';
import { WordArray } from 'https://cdn.jsdelivr.net/npm/crypto-es@1.2.7/lib/core.js';
import { MD5 } from 'https://cdn.jsdelivr.net/npm/crypto-es@1.2.7/lib/md5.js';

import { fromStream } from './snowpack/build/index.js';
import { onMouseMove } from './misc.js';


const selectHashElement = hash => {
    const elements = document.querySelectorAll(`.content[data-hash="${hash}"]`);
    return elements.length ? elements[elements.length - 1] : null;
};


const map = new Map();
const getDate = ({ dataset: { hash } }) => new Date(map.get(hash));


const websocket = new WebSocket(`wss://proxy.hwangsehyun.com/stream/ws/imshow`);
websocket.addEventListener('open', ({ target }) => console.log('Connected', target));

websocket.addEventListener('message', ({ data }) => Promise.resolve(data)
    .then(JSON.parse)

    .then(data => {
            const { hash } = data;
            console.log(data);
            map.set(data.hash, data.date);
            console.debug(map);
            return selectHashElement(hash);
        }, () => fetch('data:image/png;base64,' + data)

        .then(async res => {
            const type = await fromStream(res.clone().body)
                .then(result => result ? result.mime : 'image/svg+xml');
            const buffer = await res.arrayBuffer();
            const blob = new Blob([buffer], { type });
            console.log(blob);
            const url = URL.createObjectURL(blob);

            let element;
            if (type === 'image/svg+xml') {
                element = document.createElement('object');
                element.data = url;
                element.addEventListener('load', onMouseMove.bind(undefined, element));
            }
            else {
                element = document.createElement('img');
                element.src = url;
                onMouseMove(element);
            }
            return [element, WordArray.create(buffer)];
        })


        .then(([element, hashable]) => {
            const hash = MD5(hashable).toString();
            console.log(hash);

            element.classList.add('content');
            Object.assign(element.dataset, { hash });
            return element;
        }))

    .then(newElement => {
        if (!newElement)
            return;

        const a = getDate(newElement);
        const elements = document.querySelectorAll('.content');
        let child;
        for (let i = elements.length - 1; i >= 0; i--) {
            const element = elements[i];
            const b = getDate(element);
            if (a > b) {
                child = element;
                break;
            }
        }
        child ? child.after(newElement) : document.body.appendChild(newElement);
        window.scrollTo(0, document.body.scrollHeight);
    })
    .catch(console.error)


);
