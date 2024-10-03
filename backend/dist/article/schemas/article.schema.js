"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ArticleSchema = new mongoose_1.Schema({
    title: String,
    authors: String,
    source: String,
    pubYear: Number,
    doi: String,
    claim: String,
    evidence: String,
});
//# sourceMappingURL=article.schema.js.map