const fs = require('fs');
let content = fs.readFileSync('src/translations.js', 'utf-8');

// Reverse CP1252 decoding
// Windows-1252 maps bytes 0x00-0xFF to Unicode. We need to map Unicode back to 0x00-0xFF.
const cp1252 = [
  0x20AC, 0xFFFD, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021,
  0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, 0xFFFD, 0x017D, 0xFFFD,
  0xFFFD, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
  0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0xFFFD, 0x017E, 0x0178
];

const buf = Buffer.alloc(content.length);
let outIdx = 0;
for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code <= 0x7F || (code >= 0xA0 && code <= 0xFF)) {
        buf[outIdx++] = code;
    } else {
        // Search in the 0x80-0x9F block
        const cpIdx = cp1252.indexOf(code);
        if (cpIdx !== -1) {
            buf[outIdx++] = 0x80 + cpIdx;
        } else {
            // Unmapped character (maybe actual UTF-8 that wasn't double-encoded?)
            // Just use a placeholder or the lower byte
            buf[outIdx++] = code & 0xFF;
        }
    }
}

const recovered = buf.slice(0, outIdx).toString('utf8');
const jaIdx = recovered.indexOf('ja: {');
console.log(recovered.substring(jaIdx + 200, jaIdx + 500));
