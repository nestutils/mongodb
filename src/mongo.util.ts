import { DEFAULT_MONGO_CONNECTION_NAME } from './mongo.constants'

/**
 * Get a token for the MongoClient object for the given connection name
 * @param connectionName The unique name for the connection
 */
export function getClientConnectionName(connectionName: string = DEFAULT_MONGO_CONNECTION_NAME) {
    return `${connectionName}Client`
}

/**
 * Get a token for the Mongo Db object for the given connection name
 * @param connectionName The unique name for the connection
 */
export function getDbConnectionName(connectionName: string = DEFAULT_MONGO_CONNECTION_NAME) {
    return `${connectionName}Db`
}
