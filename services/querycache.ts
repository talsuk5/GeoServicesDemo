export class QueryCache
{
    cache: Map<string, object>;

    constructor()
    {
        this.cache = new Map();
    }

    public get(key: string)
    {
        return this.cache.get(key);
    }

    public has(key: string)
    {
        return this.cache.has(key);
    }

    public set(key: string, value: object)
    {
        this.cache.set(key, value);
    }

    public clear()
    {
        this.cache.clear();
    }
}