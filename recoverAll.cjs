const fs = require('fs');
let content = fs.readFileSync('src/translations.js', 'utf-8');

const cp1252 = [
  0x20AC, 0xFFFD, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021,
  0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, 0xFFFD, 0x017D, 0xFFFD,
  0xFFFD, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014,
  0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0xFFFD, 0x017E, 0x0178
];

const buf = Buffer.alloc(content.length * 2);
let outIdx = 0;

for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code <= 0x7F || (code >= 0xA0 && code <= 0xFF)) {
        buf[outIdx++] = code;
    } else {
        const cpIdx = cp1252.indexOf(code);
        if (cpIdx !== -1) {
            buf[outIdx++] = 0x80 + cpIdx;
        } else {
            // Encode as UTF-8 bytes if it's already a valid char?
            // Actually, if it's an emoji like 🌍, it shouldn't have been mapped.
            // Let's just output the UTF-8 bytes of this character.
            const charBytes = Buffer.from(content.charAt(i), 'utf8');
            charBytes.copy(buf, outIdx);
            outIdx += charBytes.length;
        }
    }
}

const recovered = buf.slice(0, outIdx).toString('utf8');
fs.writeFileSync('src/translations_recovered.js', recovered, 'utf-8');
console.log('Wrote to translations_recovered.js');
