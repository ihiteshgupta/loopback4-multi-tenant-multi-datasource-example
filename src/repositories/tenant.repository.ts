import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TenantDbDataSource} from '../datasources';
import {Tenant, TenantRelations} from '../models';

export class TenantRepository extends DefaultCrudRepository<
  Tenant,
  typeof Tenant.prototype.id,
  TenantRelations
> {
  constructor(
    @inject('datasources.TenantDb') dataSource: TenantDbDataSource,
  ) {
    super(Tenant, dataSource);
  }
}
