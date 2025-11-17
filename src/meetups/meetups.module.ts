import { Module } from '@nestjs/common';
import { MeetupsController } from './meetups.controller';
import { MeetupsService } from './meetups.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ApiExtraModels } from '@nestjs/swagger';
import { MeetupEntity, MeetupResponseDTO } from './meetups.dtos';

@Module({
  controllers: [MeetupsController],
  providers: [MeetupsService],
  exports: [MeetupsService],
  imports: [PrismaModule],
})
export class MeetupsModule {}