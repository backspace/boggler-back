var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.send('hello');
});

app.listen(port, () => console.log(`running at ${port}`));