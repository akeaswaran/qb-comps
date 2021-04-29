const express = require('express');
const morgan = require("morgan");
const NFL = require('./NFL');
var path = require('path');
const port = process.env.PORT || 8000;


const app = express();
app.use(morgan('[server] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/nfl', NFL);

// index page
app.get('/', function(req, res) {
    res.redirect('/nfl/');
});

// Start the frontend service
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

app.use(function (err, req, res, next) {
    if (req.method == "POST") {
        return res.status(500).json({
            status: 500,
            message: err.message
        });
    } else {
        return res.status(500).send(err.message)
    }
})