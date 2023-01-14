import Knex from "knex";
import { Model } from "objection";
import knexConfig from '../../knexfile'

export const initializeDatabase = async () => {
  const knex = Knex(knexConfig.development);
  Model.knex(knex);
}