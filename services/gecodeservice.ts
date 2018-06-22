var httprequest = require('sync-request');

export class GeocodeService
{
    url: string =  "https://eu1.locationiq.org/v1/search.php";

    public getCoordinates(address: string)
    {
        var res = httprequest('GET', this.url, 
        {
            qs:{
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