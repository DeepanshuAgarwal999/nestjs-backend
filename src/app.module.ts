import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './db.config';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), CatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
