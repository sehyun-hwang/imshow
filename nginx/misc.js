const PUB_URL = 'http://localhost:8000';
const img = document.querySelector('#initial');
const mousePositionElement = document.querySelector('#mouse-position');


export const onMouseMove = element => (element.contentWindow || element).addEventListener('mousemove', ({ clientX, clientY }) => {
    let { offsetWidth, offsetLeft, offsetHeight, offsetTop } = element;
    if (element.contentWindow)
        offsetLeft = offsetTop = 0;
    console.debug({ clientX, clientY, offsetWidth, offsetLeft, offsetHeight, offsetTop });

    mousePositionElement.textContent = [
            (clientX - offsetLeft) / offsetWidth,
            (clientY - offsetTop) / offsetHeight
        ]
        .map(x => (x * 100).toFixed(2) + '%').join(' ');
});


fetch(img.src, {
        method: 'HEAD',
    })

    .then(async res => {
        if (!res.ok) {
            img.remove();
            return Promise.reject(res);
        }

        const { type } = await res.blob();
        if (type !== 'image/svg+xml')
            return img;

        const element = document.createElement('object');
        element.classList = img.classList;
        element.data = img.src;
        document.body.appendChild(element);

        return new Promise(resolve => element.addEventListener('load', resolve))
            .then(() => {
                img.remove();
                return element;
            });
    })

    .then(onMouseMove);


window.Upload = ({ files: [file] }) => {
    console.log('Uploading', file);
    const { type } = file;

    return file.arrayBuffer()
        .then(buffer => fetch(window.PUB_URL|| PUB_URL, {
            method: "POST",
            body: new Blob([buffer], { type }),
        }).then(res => res.ok ?
            console.log('Uploaded') : res.text().then(console.log)));
};