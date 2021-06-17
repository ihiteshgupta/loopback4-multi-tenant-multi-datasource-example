import {Provider} from '@loopback/core';
import {DatasourceIdentifierFn} from "loopback4-dynamic-datasource";

export class CustomDatasourceIdentifierProvider implements Provider<DatasourceIdentifierFn> {
    constructor() {
    }

    value(): DatasourceIdentifierFn {
        return async (requestCtx) => {
            const tenantId = requestCtx.request.query['tenantId'] as string;
            return tenantId == null ? null : {id: tenantId};
        };
    }
}
