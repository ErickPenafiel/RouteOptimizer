import { Test, TestingModule } from '@nestjs/testing';
import { ConductoresController } from './conductores.controller';
import { ConductoresService } from './conductores.service';

describe('ConductoresController', () => {
  let controller: ConductoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConductoresController],
      providers: [ConductoresService],
    }).compile();

    controller = module.get<ConductoresController>(ConductoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
