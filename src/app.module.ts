import { Logger, Module, UnauthorizedException } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './common/database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './components/user/user.module';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './components/auth/auth.module';
import { ForumModule } from './components/forum/forum.module';
import { MessageModule } from './components/forum/message/message.module';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { AuthService } from './components/auth/auth.service';
import { Request } from 'express';
import { ForumsController } from './components/forum/forums.controller';
import { MessageController } from './components/forum/message/message.controller';
import { UserController } from './components/user/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (authService: AuthService) => ({
        autoSchemaFile: true,
        cors: true,
        subscriptions: {
          'graphql-ws': {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onConnect: (context: any) => {
              try {
                const request: Request = context.extra.request;
                const connectionParams = context.connectionParams || {};

                const user = authService.verifyWs(request, connectionParams);
                context.user = user;
              } catch (err) {
                new Logger().error(err);
                throw new UnauthorizedException();
              }
            },
          },
        },
      }),
      imports: [AuthModule],
      inject: [AuthService],
    }),
    DatabaseModule,
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ForumModule,
    MessageModule,
    PubSubModule,
  ],
  controllers: [
    AppController,
    ForumsController,
    MessageController,
    UserController,
  ],
  providers: [AppService],
})
export class AppModule {}
