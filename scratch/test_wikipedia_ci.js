async function run() {
    const slug = "C%C3%B4te_d%27Ivoire";
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`;
    console.log(`Fetching from URL: ${url}`);
    
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'PublicHolidayFinder/1.0 (Contact: hello@publicholidayfinder.com)'
        }
    });
    
    console.log(`Status: ${response.status}`);
    if (response.ok) {
        const data = await response.json();
        console.log(`Extract: ${data.extract}`);
    } else {
        console.log(`Error body: ${await response.text()}`);
    }
}

run();
