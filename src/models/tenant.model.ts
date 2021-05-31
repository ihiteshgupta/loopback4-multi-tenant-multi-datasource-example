import {Entity, model, property} from '@loopback/repository';

@model({
  name:'tenants'
})
export class Tenant extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'object',
    required: true,
  })
  dbConfig: object;


  constructor(data?: Partial<Tenant>) {
    super(data);
  }
}

export interface TenantRelations {
  // describe navigational properties here
}

export type TenantWithRelations = Tenant & TenantRelations;
