"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryCounter {
    constructor() {
        this.queries = new Map();
    }
    addQuery(query) {
        if (this.queries.has(query)) {
            this.queries.set(query, this.queries.get(query) + 1);
            return;
        }
        this.queries.set(query, 1);
    }
    getQueries() {
        let list = [];
        for (let [k, v] of this.queries) {
            list.push({ url: k, hits: v });
        }
        return list;
    }
}
exports.QueryCounter = QueryCounter;
//# sourceMappingURL=querycounter.js.map