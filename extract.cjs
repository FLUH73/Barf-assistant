const fs = require('fs'); 
const content = fs.readFileSync('index.html', 'utf8'); 
const scripts = content.match(/<script.*?>([\s\S]*?)<\/script>/g); 
if (scripts) { 
  scripts.forEach((s, i) => { 
    const code = s.replace(/<script.*?>|<\/script>/g, ''); 
    try { new (require('vm').Script)(code); console.log(`Script ${i} compiles OK`); } catch (e) { console.error(`Script ${i} syntax error:\n`, e.message); } 
  }); 
}
