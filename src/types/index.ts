import { ModuleMetadata } from '@nestjs/common'
import { MongoClientOptions } from 'mongodb'

/**
 * Options, which are required to create a MongoDb Connection.
 */
export interface MongoClientModuleOptions {
    uri: string
    dbName: string
    connectionName?: string
    clientOptions?: MongoClientOptions
}

/**
 * Options, which are required to create a MongoDb Connection asynchronously
 */
export interface MongoClientModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    connectionName?: string
    useFactory?: (...args: any[]) => Promise<MongoClientModuleOptions> | MongoClientModuleOptions
    inject?: any[]
}