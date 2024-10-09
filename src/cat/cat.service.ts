import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';

@Injectable()
export class CatService {
  constructor(
    @InjectRepository(Cat) private readonly catRepository: Repository<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    try {
      const cat = this.catRepository.create(createCatDto);
      return await this.catRepository.save(cat);
    } catch (error) {
      return 'unable to create cat' + error;
    }
  }

  async findAll() {
    try {
      return await this.catRepository.find();
    } catch (error) {
      return 'unable to get cats ' + error;
    }
  }

  async findOne(id: number) {
    const cat = await this.catRepository.findOneBy({ id }); // Find by id property
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.catRepository.findOneBy({ id }); // Find by id property
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    const updatedCat = await this.catRepository.update(id, updateCatDto);
    if (!updateCatDto || updatedCat.affected === 0) {
      throw new InternalServerErrorException('Unable to update cat');
    }
    return updatedCat;
  }

  async remove(id: number) {
    const cat = await this.catRepository.findOneBy({ id }); // Find by id property
    if (!cat) {
      throw new NotFoundException(`Cat with id ${id} not found`);
    }
    const isDeleted = await this.catRepository.delete(id);
    if (!isDeleted || isDeleted.affected === 0) {
      throw new InternalServerErrorException('Unable to remove cat');
    }
    return true;
  }
  async search(lte?: number, gte?: number) {
    let cats: Cat[] = [];
    
    if (!lte && !gte) {
      throw new BadRequestException('AtLeast one parameter is required ');
    }
    
    if ((lte && isNaN(lte)) || (gte && isNaN(gte))) {
      throw new BadRequestException('Invalid parameters');
    }

    if (!gte && lte) {
      cats = await this.catRepository.find({
        where: {
          age: MoreThanOrEqual(lte),
        },
      });
    } else if (!lte && gte) {
      cats = await this.catRepository.find({
        where: {
          age: LessThanOrEqual(gte),
        },
      });
    } else {
      cats = await this.catRepository.find({
        where: {
          age: Between(lte, gte),
        },
      });
    }

    return cats;
  }
}
