import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'TenantDb',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'mypassword',
  database: 'tenants'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TenantDbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'TenantDb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.TenantDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
