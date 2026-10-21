import fs from 'fs';

async function test() {
    const res = await fetch('https://date.nager.at/api/v3/PublicHolidays/2026/BJ');
    console.log("BJ:", res.status);
    const res2 = await fetch('https://date.nager.at/api/v3/PublicHolidays/2026/SN');
    console.log("SN:", res2.status);
}

test();
