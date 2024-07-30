import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OgmaInterceptor, OgmaModule } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';
import { appendFile } from 'fs';

@Module({
  imports: [
    OgmaModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        service: {
          json: config.isProd(),
          stream: {
            write: (message) => {
              appendFile(config.getLogFile(), message, (err) => {
                if (err) {
                  throw err;
                }
                return true;
              });
            },
          },
          application: config.getAppName(),
        },
        interceptor: {
          http: ExpressParser,
          ws: false,
          gql: false,
          rpc: false,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: OgmaInterceptor,
    },
  ],
})
export class AppModule {}
