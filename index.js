
'use strict';

var express = require( 'express' );
// var cors = require( 'cors' );
var path = require( 'path' );
var cookieParser = require( 'cookie-parser' );
var bodyParser = require( 'body-parser' );


var app = express();

// app.use( cors() );

var port = process.env.PORT || 5000;

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

app.use( bodyParser.json( {limit : '50mb'} ) );
app.use( bodyParser.urlencoded( { extended : true, limit : '50mb' } ) );
app.use( cookieParser() );


// var api = require('./api/index');
// app.use( '/api', api );

app.use( express.static( 'public' ) );

app.listen( port );
console.log( 'TigerTrack Server : Online : port ' + port );

module.exports = app;
