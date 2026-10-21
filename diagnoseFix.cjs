const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// The ternary at line 437 opens the else branch but the `overflow-x-auto` div needs to be wrapped
// We also need to close the div before the ) that ends the ternary
// Current structure (approximate):
//   437: ) : (
//   438: <div className="overflow-x-auto">
//   ...
//   501: </table>
//   502: )}    <- this is the ternary close we injected, but its BEFORE </div>

// Fix: wrap the else branch in a fragment
// Find line 437: ) : (
const elseIdx = lines.findIndex((l, i) => i > 430 && l.trim() === ') : (');
const divEnd = lines.findIndex((l, i) => i > 499 && l.includes('</div>') && i < 510);

console.log('Else idx:', elseIdx, 'Div end idx:', divEnd);
console.log('Line at else:', lines[elseIdx]);
console.log('Line at div end:', lines[divEnd]);
console.log(lines.slice(499, 508).map((l, i) => (499+i) + ': ' + l).join('\n'));
