import express = require('express');
import { QueryCache } from './services/querycache';
import { GeocodeService } from './services/gecodeservice';
import { WikiNearbyService } from './services/wikinearbyservice';
import { QueryCounter } from './services/querycounter';

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var auth = require('express-basic-auth');

var geocodecache = new QueryCache();
var wikiNearbycache = new QueryCache();
var queries = new QueryCounter();
var geoService = new GeocodeService();
var wikiService = new WikiNearbyService();

let app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/purgeCache', upload.array(), (request, response) => {    
    queries.addQuery(request.url);
    
    geocodecache.clear();
    wikiNearbycache.clear();

    response
    .send('cache purged');
});

app.get('/geocode', (request, response) => {
    queries.addQuery(request.url);
    if (!isNaN(request.query.address)) 
    {
        response
            .status(400)
            .send('No string as address');
        return;
    }

    var address = request.query.address;

    if(geocodecache.has(address))
    {
        response.json(geocodecache.get(address));
        return;
    }

    var result = geoService.getCoordinates(address);

    geocodecache.set(address, result);
    
    response.json(result);
});

app.get('/wikiNearby', (request, response) => {
    queries.addQuery(request.url);
    if (isNaN(request.query.lat) || isNaN(request.query.lon)) 
    {
        response
            .status(400)
            .send('lat or lon are missing');
        return;
    }

    var coords = request.query.lat + "|" + request.query.lon;
    if(wikiNearbycache.has(coords))
    {
        response.json(wikiNearbycache.get(coords));
        return;
    }
    
    var result = wikiService.getNearbysList(coords);

    wikiNearbycache.set(coords, result);    
    
    response.json(result);
});

app.use(auth({
    users: { 'admin': 'supersecret' }
}))
app.get('/usage', (request, response) => {
    queries.addQuery(request.url);
    
    var result = queries.getQueries();

    response.json(result);
});

app.listen(3000);