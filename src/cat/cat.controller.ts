import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { CatService } from './cat.service';
// import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ParsedIdPipe } from './pipes/parsedPipes';
import { CreateCatDto } from './dto/create-cat.dto';
import { JoiValidationPipe } from './pipes/joiValidationPipe';
import { CatJoiSchema } from './dto/create-cat-joi.dto';

@Controller('cat')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CatJoiSchema))
  create(@Body() createCatDto: CreateCatDto) {
    return this.catService.create(createCatDto);
  }

  @Get()
  async findAll() {
    return await this.catService.findAll();
  }
  
  @Get('/search')
  findBySearch(@Query('lte') lte?: number, @Query('gte') gte?: number) {
    return this.catService.search(lte, gte);
  }

  @Get(':id')
  findOne(@Param('id', ParsedIdPipe) id: number) {
    return this.catService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(
    @Param('id', ParsedIdPipe) id: number,
    @Body() updateCatDto: UpdateCatDto,
  ) {
    return this.catService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id', ParsedIdPipe) id: number) {
    return this.catService.remove(+id);
  }
}
