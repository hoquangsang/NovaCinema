import escapeStringRegexp from 'escape-string-regexp';
import { FilterQuery } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { pickSortableFields } from 'src/modules/base/helpers';
import { UserDocument } from '../schemas';
import { UserRepository } from '../repositories';
import { UserInputTypes as InputTypes } from './user.service.type';
import { UserQueryFields as QUERY_FIELDS } from './user.service.constant';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  /** */
  public async findUserById(id: string) {
    return this.userRepo.query.findOneById({
      id,
      exclusion: { password: false },
    });
  }

  /** */
  public async findUsersPaginated(options: InputTypes.PaginatedQuery) {
    console.log(options);
    const { search, page, limit, sort, ...rest } = options;
    const filter: FilterQuery<UserDocument> = {};

    // search fields
    if (search) {
      const r = new RegExp(escapeStringRegexp(search), 'i');
      filter.$or = QUERY_FIELDS.SEARCHABLE.map((f) => ({ [f]: r }));
    }

    // regex fields
    QUERY_FIELDS.REGEX_MATCH.forEach((f) => {
      if (rest[f] !== undefined)
        filter[f] = new RegExp(escapeStringRegexp(rest[f]), 'i');
    });

    // array fields
    QUERY_FIELDS.ARRAY_MATCH.forEach((f) => {
      if (rest[f]?.length) filter[f] = { $in: rest[f] };
    });

    // exact match fields
    QUERY_FIELDS.EXACT_MATCH.forEach((f) => {
      if (rest[f] !== undefined) filter[f] = rest[f];
    });

    // safe sort
    const safeSort = pickSortableFields(options.sort, QUERY_FIELDS.SORTABLE);

    //
    const result = await this.userRepo.query.findManyPaginated({
      filter,
      page,
      limit,
      sort: safeSort,
      exclusion: { password: false },
    });

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  /** */
  public async updateUserById(id: string, update: InputTypes.Update) {
    const result = await this.userRepo.command.updateOneById({
      id,
      update,
    });
    if (!result.matchedCount) throw new NotFoundException('User not found');

    return result.modifiedItem;
  }

  /** */
  public async activateUserById(id: string) {
    return this.updateUserStatusById(id, true);
  }

  public async deactivateUserById(id: string) {
    return this.updateUserStatusById(id, false);
  }

  private async updateUserStatusById(id: string, active: boolean) {
    const result = await this.userRepo.command.updateOneById({
      id,
      update: { active },
    });
    if (!result.matchedCount || !result.modifiedCount)
      throw new NotFoundException('User not found');
  }

  /** */
  public async deleteUserById(id: string) {
    const exists = await this.userRepo.query.exists({ filter: { _id: id } });
    if (!exists) throw new NotFoundException('User not found');

    const result = await this.userRepo.command.deleteOneById({ id });
    if (!result.deletedCount)
      throw new InternalServerErrorException('Deletion failed');
  }
}
