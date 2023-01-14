import { UserModel } from './database/models/users.model';
import { loadConfig } from './config/index';
import { initializeDatabase } from './database/database';
import { startServer } from "./server"
import { randomInt, randomUUID } from 'crypto';

const main = async () => {
    console.clear()
    await loadConfig()
    await initializeDatabase()
    await startServer()
}

main()