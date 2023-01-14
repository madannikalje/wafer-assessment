module.exports = {
    development: {
            client: 'pg',
            connection: {
            host: "database-1.clypw1lkrb0q.ap-south-1.rds.amazonaws.com",
            user: "postgres",
            password: "madan12!",
            database: "test_db",
        },
        migrations: {
        directory: './src/database/migrations',
        tableName: 'knex_migrations'
        },
    }
}