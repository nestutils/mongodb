import { Inject } from '@nestjs/common'
import { getClientConnectionName, getDbConnectionName } from './mongo.util'

/**
 * Inject the MongoClient object associated with a connection
 * @param connectionName The unique name associated with the connection
 */
export const InjectClient = (connectionName?: string) =>
    Inject(getClientConnectionName(connectionName))

/**
 * Inject the Mongo Db object associated with a connection
 * @param connectionName The unique name associated with the database connection
 */
export const InjectDb = (connectionName?: string) => Inject(getDbConnectionName(connectionName))
