'use strict';

/** Module dependencies. */
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const logger = require('morgan');
const routes = require('./routes');
const Playlist = require('./model/playlist');
const Party = require('./model/party');
const mongoose = require('mongoose');
mongoose.connect('mongodb://test:hackthenorth18@ds257732.mlab.com:57732/spotify-playlist'); // connect to database
var cors = require('cors');

const port = process.env.PORT || 3000;

// configure the express server
const app = express();

app.use(cors());

// if we're developing, use webpack middleware for module hot reloading
if (process.env.NODE_ENV !== 'production') {
    console.log('==> 🌎 using webpack');

    // load and configure webpack
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack/dev.config');

    // setup middleware
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
    app.use(webpackHotMiddleware(compiler));
}

app.set('port', port);
app.use(logger('dev'))
    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(express.static(path.resolve(__dirname, '../public')))
    .use('/', routes);

app.post('/playlist', function(req, res, next) {

    Party.findOne({ _id: req.body.partyId }, (err, data) => {
        if (err) throw err;
        if (data) {
            data.playlists.push(`${req.body.playlistId}`);
            data.save((err, saveData) => {
                if (err) throw err;
            });
        } else {
            var party = new Party();
            party.playlists = [`${req.body.playlistId}`];  // set the bears name (comes from the request)
            party.partyId = req.body.partyId;  // set the bears name (comes from the request)
            party.userEmail = req.body.userEmail;  // set the bears name (comes from the request)
            party.save(function(err) {
                if (err) { return next(err); }

                res.json({ message: 'playlist added!' });
            });
        }
    })
});

app.post('/addMatchedList', function(req, res, next) {

    Party.findOne({ _id: req.body.partyId }, (err, data) => {
        if (err) throw err;
        if (data) {
            data.matchedTracks.push(`${req.body.matchedTracks}`);
            data.save((err, saveData) => {
                if (err) throw err;
            });
        } else {
            var party = new Party();
            party.matchedTracks = [`${req.body.matchedTracks}`];  // set the bears name (comes from the request)
            party.partyId = req.body.partyId;  // set the bears name (comes from the request)
            party.playlists = req.body.playlists;  // set the bears name (comes from the request)
            party.userEmail = req.body.userEmail;  // set the bears name (comes from the request)
            party.save(function(err) {
                if (err) { return next(err); }

                res.json({ message: 'playlist added!' });
            });
        }
    })
});

// Start her up, boys
app.listen(app.get('port'), () => {
    console.log('Express server listening on port ' + app.get('port'));
});
