import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {
  static forRoot(options?: { isGlobal?: boolean }): DynamicModule {
    const module: DynamicModule = {
      module: PrismaModule,
      providers: [PrismaService],
      exports: [PrismaService],
      global: options?.isGlobal ?? false,
    };
    return module;
  }
}
