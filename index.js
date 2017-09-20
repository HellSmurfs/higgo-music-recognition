var express = require('express');
var config = require('app-config');
var app = express();
var acr = require('./music_identification');
var nest_streaming = require('./nest_stream');


// Enable cross domain
app.use(function(req, res, next) {
	  res.header('Access-Control-Allow-Origin', '*');
	  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	  next();
});


var acr_config = config.settings.acr;

app.get( '/api/nest/identification', function(req, res) {
    console.dir(req.query);
    var stream_url = req.query.stream_url;

    console.log(stream_url);

    nest_streaming.generate_stream(stream_url).then(function(filename) {
        return acr.identify(acr_config.host, acr_config.access_key, acr_config.access_secret, filename).then(function(bandName) {
            jsonout = { 'bandName': bandName };
            res.json (jsonout);
        });
    });
});

// Start server
app.listen( process.env.PORT || 6666, function() {
	  console.log( 'listening' );
});
