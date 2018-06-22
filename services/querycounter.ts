export class QueryCounter
{
    queries : Map<string, number> = new Map();

    public addQuery(query: string)
    {
        if(this.queries.has(query))
        {
            this.queries.set(query, this.queries.get(query) + 1);
            return;
        }
    
        this.queries.set(query, 1);
    }
    
    public getQueries()
    {
        let list = [];
        for (let [k,v] of this.queries)
        {
            list.push({url:k, hits:v});
        }

        return list;
    }
}


