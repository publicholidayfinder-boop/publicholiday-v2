const fs = require('fs');
const continents = fs.readFileSync('src/lib/continents.js', 'utf8');

const allAfrica = {
  'DZ': 'Algeria', 'AO': 'Angola', 'BJ': 'Benin', 'BW': 'Botswana', 'BF': 'Burkina Faso',
  'BI': 'Burundi', 'CV': 'Cabo Verde', 'CM': 'Cameroon', 'CF': 'Central African Republic',
  'TD': 'Chad', 'KM': 'Comoros', 'CD': 'Democratic Republic of the Congo',
  'CG': 'Republic of the Congo', 'CI': 'Cote d Ivoire', 'DJ': 'Djibouti', 'EG': 'Egypt',
  'GQ': 'Equatorial Guinea', 'ER': 'Eritrea', 'SZ': 'Eswatini', 'ET': 'Ethiopia',
  'GA': 'Gabon', 'GM': 'Gambia', 'GH': 'Ghana', 'GN': 'Guinea', 'GW': 'Guinea-Bissau',
  'KE': 'Kenya', 'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libya', 'MG': 'Madagascar',
  'MW': 'Malawi', 'ML': 'Mali', 'MR': 'Mauritania', 'MU': 'Mauritius', 'MA': 'Morocco',
  'MZ': 'Mozambique', 'NA': 'Namibia', 'NE': 'Niger', 'NG': 'Nigeria', 'RW': 'Rwanda',
  'ST': 'Sao Tome and Principe', 'SN': 'Senegal', 'SC': 'Seychelles', 'SL': 'Sierra Leone',
  'SO': 'Somalia', 'ZA': 'South Africa', 'SS': 'South Sudan', 'SD': 'Sudan',
  'TZ': 'Tanzania', 'TG': 'Togo', 'TN': 'Tunisia', 'UG': 'Uganda', 'ZM': 'Zambia', 'ZW': 'Zimbabwe'
};

const missing = [];
for (const code of Object.keys(allAfrica)) {
    if (!continents.includes(`'${code}': 'Africa'`)) {
        missing.push(code);
    }
}
console.log('Missing from mapping:', missing);
