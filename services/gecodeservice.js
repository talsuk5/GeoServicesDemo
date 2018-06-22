"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httprequest = require('sync-request');
class GeocodeService {
    constructor() {
        this.url = "https://eu1.locationiq.org/v1/search.php";
    }
    getCoordinates(address) {
        var res = httprequest('GET', this.url, {
            qs: {
                key: '996bff837c908a',
                q: address,
                format: 'json'
            },
        });
        var json = JSON.parse(res.getBody());
        var result = {
            lat: parseFloat(json[0].lat),
            lon: parseFloat(json[0].lon)
        };
        return result;
    }
}
exports.GeocodeService = GeocodeService;
//# sourceMappingURL=gecodeservice.js.map