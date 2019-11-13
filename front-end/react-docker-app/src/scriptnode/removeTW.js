var fs = require('fs')
file1 = process.argv[2], file2= process.argv[3];
fs.writeFile(file1, " ", function (err) {
    if (err) { return console.log(err); }
});
var str = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n"
fs.writeFile(file2, str, function (err) {
    if (err) { return console.log(err); }
});