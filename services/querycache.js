"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryCache {
    constructor() {
        this.cache = new Map();
    }
    get(key) {
        return this.cache.get(key);
    }
    has(key) {
        return this.cache.has(key);
    }
    set(key, value) {
        this.cache.set(key, value);
    }
    clear() {
        this.cache.clear();
    }
}
exports.QueryCache = QueryCache;
//# sourceMappingURL=querycache.js.map