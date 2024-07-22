"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const postgresql_1 = require("@mikro-orm/postgresql");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations")
    },
    driver: postgresql_1.PostgreSqlDriver,
    dbName: "reddit",
    user: "postgres",
    password: "postgres",
    port: 5000,
    debug: !constants_1.__prod__,
    entities: [Post_1.Post],
    allowGlobalContext: true
};
//# sourceMappingURL=mikro-orm.config.js.map