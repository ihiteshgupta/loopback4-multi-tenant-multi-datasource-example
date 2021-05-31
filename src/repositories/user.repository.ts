import {inject} from '@loopback/core';
import {DefaultCrudRepository, JugglerDataSource} from '@loopback/repository';
import {User, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<User,
  typeof User.prototype.id,
  UserRelations> {
  constructor(
    @inject('datasources.multi-tenant-db') dataSource: JugglerDataSource,
  ) {
    super(User, dataSource);
  }
}
