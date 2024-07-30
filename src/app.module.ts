import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OgmaInterceptor, OgmaModule } from '@ogma/nestjs-module';
import { ExpressParser } from '@ogma/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    OgmaModule.forRoot({
      // @ts-ignore
      service: {
        color: true,
        json: false,
        application: 'my-app',
      },
      interceptor: {
        http: ExpressParser,
        ws: false,
        gql: false,
        rpc: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: OgmaInterceptor,
    },
  ],
})
export class AppModule {}
