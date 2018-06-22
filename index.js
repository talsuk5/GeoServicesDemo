"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const querycache_1 = require("./services/querycache");
const gecodeservice_1 = require("./services/gecodeservice");
const wikinearbyservice_1 = require("./services/wikinearbyservice");
const querycounter_1 = require("./services/querycounter");
let app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var auth = require('express-basic-auth');
var geocodecache = new querycache_1.QueryCache();
var wikiNearbycache = new querycache_1.QueryCache();
var queries = new querycounter_1.QueryCounter();
var geoService = new gecodeservice_1.GeocodeService();
var wikiService = new wikinearbyservice_1.WikiNearbyService();
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
    if (!isNaN(request.query.address)) {
        response
            .status(400)
            .send('No string as address');
        return;
    }
    var address = request.query.address;
    var result;
    if (geocodecache.has(address)) {
        response.json(geocodecache.get(address));
        return;
    }
    result = geoService.getCoordinates(address);
    geocodecache.set(address, result);
    response.json(result);
});
app.get('/wikiNearby', (request, response) => {
    queries.addQuery(request.url);
    if (isNaN(request.query.lat) || isNaN(request.query.lon)) {
        response
            .status(400)
            .send('lat or lon are missing');
        return;
    }
    var ggscoord = request.query.lat + "|" + request.query.lon;
    var result;
    if (wikiNearbycache.has(ggscoord)) {
        response.json(wikiNearbycache.get(ggscoord));
        return;
    }
    result = wikiService.getNearbysList(ggscoord);
    wikiNearbycache.set(ggscoord, result);
    response.json(result);
});
app.use(auth({
    users: { 'admin': 'supersecret' }
}));
app.get('/usage', (request, response) => {
    queries.addQuery(request.url);
    var result = queries.getQueries();
    response.json(result);
});
app.listen(3000);
//# sourceMappingURL=index.js.map