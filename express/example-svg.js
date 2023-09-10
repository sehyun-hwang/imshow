import { generate } from 'random-words';

const hue = Math.random() * 360;
const text = generate(3).join(' ');

const svg = `<svg version="1.1"
     width="300" height="200"
     xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="hsl(${hue}, 100%, 50%)" />
  <text x="0" y="125" font-size="100" fill="white">${text}</text>
</svg>`;
process.stderr.write(svg);
process.stderr.write('\n');

console.log(svg);