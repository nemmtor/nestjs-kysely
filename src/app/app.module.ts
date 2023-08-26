import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { DatabaseModule } from 'src/database';
import { HealthModule } from 'src/health';

@Module({
  imports: [
    HealthModule,
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database');
        return {
          host: databaseConfig.host,
          port: databaseConfig.port,
          database: databaseConfig.name,
          user: databaseConfig.user,
          password: databaseConfig.password,
        };
      },
    }),
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
