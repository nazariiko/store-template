import { Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from '../../entities/base/base-model.entity';
import { ICreatedUpdated } from '../../models/interfaces/created-updated';

export abstract class BaseService<Entity extends BaseModel> {
  @Inject(WINSTON_MODULE_NEST_PROVIDER)
  protected readonly _logger: LoggerService;

  constructor(protected readonly _repository: Repository<Entity>) {}

  public async getAll(): Promise<Entity[]> {
    const items = await this._repository.find();
    return items;
  }

  public async getById(id: number): Promise<Entity | null> {
    const item = await this._repository.findOneBy({
      id: id,
    } as FindOptionsWhere<Entity>);
    return item;
  }

  public async findByOptions(
    options: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    const items = await this._repository.find(options);
    return items;
  }

  public async findOneByOptions(
    options: FindOneOptions<Entity>,
  ): Promise<Entity | null> {
    const item = await this._repository.findOne(options);
    return item;
  }

  public async create(model: Entity): Promise<Entity> {
    model = await this._repository.save(model, { transaction: false });
    return model;
  }

  public async createMany(
    model: Entity[],
    transaction = true,
  ): Promise<Entity[]> {
    model = await this._repository.save(model, { transaction: transaction });
    return model;
  }

  public async removeByEntity(item: Entity): Promise<Entity> {
    const result = await this._repository.remove(item);
    return result;
  }

  public async removeById(id: number): Promise<Entity> {
    const result = await this._repository.remove({ id } as Entity);
    return result;
  }

  public async removeManyById(items: { id: number }[]): Promise<Entity[]> {
    const result = await this._repository.remove(items as Entity[]);
    return result;
  }

  public async update(model: Entity): Promise<Entity> {
    return await this._repository.save(model, { transaction: false });
  }

  public async updateMany(
    model: Entity[],
    transaction = true,
  ): Promise<Entity[]> {
    model = await this._repository.save(model, { transaction: transaction });
    return model;
  }

  public count(options: FindManyOptions<Entity>): Promise<number> {
    return this._repository.count(options);
  }

  public merge(model: Entity, entityLikes: DeepPartial<Entity>): Entity {
    return this._repository.merge(model, entityLikes);
  }

  public getCreatedUpdated(userId: number): ICreatedUpdated {
    const date = new Date();
    return {
      createdDate: date,
      createdByUserId: userId,
      updatedDate: date,
      updatedByUserId: userId,
    };
  }
}
