import express = require('express');
import { QueryCache } from './services/querycache';
import { GeocodeService } from './services/gecodeservice';
import { WikiNearbyService } from './services/wikinearbyservice';
import { QueryCounter } from './services/querycounter';
let app = express();

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var auth = require('express-basic-auth');

var geocodecache = new QueryCache();
var wikiNearbycache = new QueryCache();
var queries = new QueryCounter();
var geoService = new GeocodeService();
var wikiService = new WikiNearbyService();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/purgeCache', upload.array(), (request, response) => {    
    queries.addQuery(request.url);
    
    geocodecache.clear();
    wikiNearbycache.clear();

    response
    .status(200)
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
    var result;
    if(geocodecache.has(address))
    {
        response.json(geocodecache.get(address));
        return;
    }

    result = geoService.getCoordinates(address);

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

    var ggscoord = request.query.lat + "|" + request.query.lon;
    var result;
    if(wikiNearbycache.has(ggscoord))
    {
        response.json(wikiNearbycache.get(ggscoord));
        return;
    }
    
    result = wikiService.getNearbysList(ggscoord);

    wikiNearbycache.set(ggscoord, result);    
    
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