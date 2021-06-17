import {Provider} from '@loopback/core';
import {juggler, repository} from "@loopback/repository";
import {TenantRepository} from "../repositories";
import {DatasourceProviderFn} from "loopback4-dynamic-datasource";

export class CustomDatasourceProvider implements Provider<DatasourceProviderFn> {
    constructor(
        @repository(TenantRepository)
        private tenantRepo: TenantRepository,
    ) {
    }

    value(): DatasourceProviderFn {
        return async (datasourceIdentifier) => {
            return {
                pgdb: async () => {
                    const tenantData = await this.tenantRepo.findById(datasourceIdentifier.id);
                    return new juggler.DataSource({
                        name: 'postgres-data',
                        ...tenantData.dbConfig,
                    });
                }
            }
        }
    }
}
