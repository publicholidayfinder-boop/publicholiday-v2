const fs = require('fs');
const lines = fs.readFileSync('src/pages/CountryPage.jsx', 'utf-8').split('\n');

// The ternary else branch at line 437 starts with:
//   ) : (
//   <div className="overflow-x-auto">   <- line 438 (not indented inside fragment)
// And the closing at 502 is )} which is wrong because it closes without the </div> at 503

// Fix: 
// 1. Close the </div> (overflow-x-auto) BEFORE the ternary close
// 2. The )} we injected at 502 needs to be AFTER </div>
// Current state: 501 </table>, 502 )}, 503 </div>  -- WRONG order

// Swap line 502 )} with line 503 </div>
const ternaryClose = 502; // line with )} we injected
const divClose = 503;     // line with </div> for overflow-x-auto

// Swap them
const temp = lines[ternaryClose];
lines[ternaryClose] = lines[divClose];
lines[divClose] = temp;

fs.writeFileSync('src/pages/CountryPage.jsx', lines.join('\n'), 'utf-8');
console.log('Fixed: swapped </div> and )} to correct order.');
console.log(lines.slice(499, 508).map((l, i) => (499+i) + ': ' + l).join('\n'));
