import { Module, DynamicModule, Provider } from '@nestjs/common'
import { Logger } from '@nestutils/logger'
import { MongoClient, MongoClientOptions } from 'mongodb'
import {
    DEFAULT_MONGO_CONNECTION_NAME,
    MONGO_CONNECTION_NAME,
    MONGO_MODULE_OPTIONS
} from './mongo.constants'
import { getClientConnectionName, getDbConnectionName } from './mongo.util'
import { MongoClientModuleAsyncOptions, MongoClientModuleOptions } from './types'

/**
 * Module for the MongoDB driver
 */
@Module({})
export class MongoClientModule {
    private static readonly logger = new Logger({
        context: MongoClientModule.name
    })
    /**
     * Inject the MongoDB driver synchronously.
     * @param uri The database URI
     * @param dbName The database name
     * @param options Options for the MongoClient that will be created
     * @param connectionName A unique name for the connection.  If not specified, a default name
     * will be used.
     */
    static forRoot(options: MongoClientModuleOptions): DynamicModule {
        const connectionNameProvider = {
            provide: MONGO_CONNECTION_NAME,
            useValue: options.connectionName ?? DEFAULT_MONGO_CONNECTION_NAME
        }

        const clientProvider = {
            provide: getClientConnectionName(options.connectionName),
            useFactory: async () => this.getMongoDBClient(options.uri, options.clientOptions)
        }

        const dbProvider = {
            provide: getDbConnectionName(options.connectionName),
            useFactory: (client: MongoClient) => client.db(options.dbName),
            inject: [getClientConnectionName(options.connectionName)]
        }

        return {
            module: MongoClientModule,
            providers: [connectionNameProvider, clientProvider, dbProvider],
            exports: [clientProvider, dbProvider]
        }
    }

    /**
     * Inject MongoDB Driver asynchronously.
     * @param options Async options to configure MongoClientModule.
     */
    static forRootAsync(options: MongoClientModuleAsyncOptions) {
        const mongoConnectionName = options.connectionName ?? DEFAULT_MONGO_CONNECTION_NAME

        const connectionNameProvider = {
            provide: MONGO_CONNECTION_NAME,
            useValue: mongoConnectionName
        }

        const clientProvider = {
            provide: getClientConnectionName(options.connectionName),
            useFactory: async (options: MongoClientModuleOptions) =>
                this.getMongoDBClient(options.uri, options.clientOptions),
            inject: [MONGO_MODULE_OPTIONS]
        }

        const dbProvider = {
            provide: getDbConnectionName(mongoConnectionName),
            useFactory: (mongoModuleOptions: MongoClientModuleOptions, client: MongoClient) =>
                client.db(mongoModuleOptions.dbName),
            inject: [MONGO_MODULE_OPTIONS, getClientConnectionName(mongoConnectionName)]
        }

        const asyncProviders = this.createAsyncProviderFromUseFactory(options)

        return {
            module: MongoClientModule,
            imports: options.imports,
            providers: [...asyncProviders, clientProvider, dbProvider, connectionNameProvider],
            exports: [clientProvider, dbProvider]
        }
    }

    /**
     * This Method can be used to create async provider from provided user factory.
     * @param options Options, which were passed to initialize async MongoClientModule.
     * @returns List of providers.
     */
    private static createAsyncProviderFromUseFactory(
        options: MongoClientModuleAsyncOptions
    ): Provider[] {
        if (options.useFactory) {
            return [
                {
                    provide: MONGO_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject ?? []
                }
            ]
        } else {
            return []
        }
    }

    /**
     * This method can be used to generate a new MongoDB Connection.
     * @param uri database URI
     * @param clientOptions options, which can be used while connecting with database.
     * @returns
     */
    private static async getMongoDBClient(
        uri: string,
        clientOptions: MongoClientOptions = {}
    ): Promise<MongoClient> {
        this.logger.info('Creating Connection With MongoDB')
        try {
            const client = await MongoClient.connect(uri, clientOptions)
            this.logger.info('MongoDB Connection Successful.')
            return client
        } catch (error) {
            this.logger.error(error)
            this.logger.error('Failed to connect with MongoDB')
            throw error
        }
    }
}
