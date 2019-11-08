var fs = require('fs')
    start1 = process.argv[2], destiny=process.argv[3];

fs.readFile(start1, 'utf8', function (err, data) {
    if (err) throw err;
    fs.appendFile(destiny, data, function (err) {
        if (err) { return console.log(err); }
    });
});
/*
fs.readFile(start2, 'utf8', function (err, data) {
    if (err) throw err;
    fs.appendFile(destiny, data, function (err) {
        if (err) { return console.log(err); }
    });
});
*/