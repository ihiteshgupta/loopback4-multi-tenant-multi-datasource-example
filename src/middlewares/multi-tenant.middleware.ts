import {BindingKey, CoreBindings, inject, injectable, Provider} from '@loopback/core';
import {asMiddleware, Middleware, RequestContext, RestApplication} from '@loopback/rest';
import {juggler, repository} from '@loopback/repository';
import {TenantRepository} from '../repositories';
import {Tenant} from '../models';

export const CURRENT_TENANT = BindingKey.create<Tenant>(
  'multi-tenant.currentTenant',
);

@injectable(
  asMiddleware({
    group: 'middleware',
    downstreamGroups: 'findRoute',
  }),
)
export class MultiTenantMiddleware implements Provider<Middleware> {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE)
    private application: RestApplication,
    @repository(TenantRepository)
    private tenantRepo: TenantRepository,
  ) {
  }

  value(): Middleware {
    return async (ctx, next) => {
      await this.action(ctx as RequestContext);
      return next();
    };
  }

  async action(requestCtx: RequestContext) {
    const tenant = await this.getTenant(requestCtx);
    if (tenant == null) return;
    const tenantData = await this.tenantRepo.findById(tenant.id);
    requestCtx.bind(CURRENT_TENANT).to(tenantData);
    const tenantDbName = `datasources.multi-tenant-db.${tenantData.id}`;
    if (!this.application.isBound(tenantDbName)) {
      const tenantDb = new juggler.DataSource({
        name: tenantDbName,
        ...tenantData.dbConfig,
      });
      this.application.bind(tenantDbName).to(tenantDb).tag('datasource');
    }
    requestCtx
      .bind('datasources.multi-tenant-db')
      .toAlias(tenantDbName);
    return tenant;
  }

  private async getTenant(requestCtx: RequestContext) {
    // extract tenant from token query host any pattern
    const tenantId = requestCtx.request.query['tenantId'] as string;
    return tenantId == null ? undefined : {id: tenantId};
  }
}
