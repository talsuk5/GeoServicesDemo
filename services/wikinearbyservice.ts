var httprequest = require('sync-request');

export class WikiNearbyService
{
    url: string =  "https://en.wikipedia.org/w/api.php";
    
    public getNearbysList(ggscoord: string)
    {
        var res = httprequest('GET', this.url, 
        {
            qs:{
                action: 'query',
                prop: 'coordinates|pageimages',
                colimit: 50,
                piprop: 'thumbnail',
                generator: 'geosearch',
                ggscoord: ggscoord,
                ggsradius: 10000,
                ggslimit: 50,
                format: 'json'
            }
        });
        
        var json = JSON.parse(res.getBody());
        var reslist = [];
        var list = json['query']['pages'];
        
        for(var id in list)
        {
            var obj = json['query']['pages'][id];
            
            try
            {
                var elem = 
                {
                    title: obj["title"],
                    thumbnailUrl: obj["thumbnail"]["source"],
                    coordinates: 
                    {
                        lat: parseFloat(obj["coordinates"][0]["lat"]),
                        lon: parseFloat(obj["coordinates"][0]["lon"]),
                    }                
                }
        
                reslist.push(elem);
            }
            catch (err)
            {
                console.log("error in parse of " + id)
            }             
        } 

        return reslist;
    }
}

