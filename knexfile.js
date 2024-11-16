const shardConfig = {
    client: "sqlite3",
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./data/seeds" },
    //sqlite3 below
    useNullAsDefault: true,
    pool: { afterCreate:(conn, done) => conn.run("PRAGMA foreign_key = ON", done) },
}

module.exports = {
    development: {
        ...shardConfig,
        connection: { filename: "./data/cook_book.db3" },
    },
    testing: {
        ...shardConfig,
        connection: { filename: "./data/cook_book.test.db3" },
    },
    production: {}
}