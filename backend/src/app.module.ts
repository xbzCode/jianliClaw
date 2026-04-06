import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { ResumeModule } from './modules/resume/resume.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule, AuthModule, ResumeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
