import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {CustomDatasourceProvider} from "./providers/custom-datasource.provider";
import {CustomDatasourceIdentifierProvider} from "./providers/custom-datasource-identifier.provider";
import {
  DynamicDatasourceBindings,
  DynamicDatasourceMiddlewareProvider,
  Loopback4DynamicDatasourceComponent
} from "loopback4-dynamic-datasource";

export {ApplicationConfig};

export class Loopback4MultiTenantMultiDatasourceExampleApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(Loopback4DynamicDatasourceComponent);
    this.middleware(DynamicDatasourceMiddlewareProvider);
    this.bind(DynamicDatasourceBindings.DATASOURCE_PROVIDER).toProvider(CustomDatasourceProvider);
    this.bind(DynamicDatasourceBindings.DATASOURCE_IDENTIFIER_PROVIDER).toProvider(CustomDatasourceIdentifierProvider);
    this.component(RestExplorerComponent);
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      }
    };
  }
}
