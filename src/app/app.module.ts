import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from 'src/config';
import { DatabaseModule } from 'src/database';
import { HealthModule } from 'src/health';

@Module({
  imports: [
    HealthModule,
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // TODO: register as namespace so I can access "database.host" instead of whole obj
        const dbConfig = configService.get('database');
        return {
          host: dbConfig.host,
          port: dbConfig.port,
          database: dbConfig.name,
          user: dbConfig.user,
          password: dbConfig.password,
        };
      },
    }),
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
