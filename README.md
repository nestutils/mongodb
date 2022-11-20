<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<h1 align="center">@nestutils/mongodb</h1>

## Description
This NestJS Module can be used to connect with MongoDB and provide common connection across application/Specified Modules.

## Installation
In your existing NestJS-based project:
```
$ npm install --save @nestutils/mongodb
```

## Usage
To Use MongoDB Client synchronously, one can use below configuration:
```typescript
import { Module } from '@nestjs/common'
import { MongoClientModule } from '@nestutils/config-client'
@Module({
    imports: [
      MongoClientModule.forRoot({
        uri: '************' // MongoDB SRV Uri, which will be used to connect with DB Instance.
        dbName: '***********' // Database Name, which needs to be connected default with connection.
        connectionName: '**********' // Name of current connection, which further can be used for DI.
        clientOptions: {'******': '****', '*****': '*****'}  // Connection options, which will be used to connect with MongoDB.
    }),
      ]
})
export class AppModule {}
```

To Use MongoDB Client asynchronously, one can use below configuration:
```typescript
import { Module } from '@nestjs/common'
import { MongoClientModule } from '@nestutils/config-client'
@Module({
    imports: [
      MongoClientModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ClientConfigService) => ({
        uri: configService.uri,
        dbName: configService.dbName
    }),
    inject: [ConfigService]
    }),
      ]
})
export class AppModule {}
```

## Contributions
Any suggestions, issues, bug-fixes, PR's are most welcomed. Thanks.

## Note
This project is currently in active development 🚧. Breaking changes are expected.