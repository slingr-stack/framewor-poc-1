// framework/core/RepositoryFactory.ts
import { IRepository } from "./IRepository";
import { RepositoryType, getRepositoryType } from "./decorators";

import { SqlRepository } from "../dataSources/SqlRepository";
import { RestRepository } from "../dataSources/RestRepository";
import { InMemoryRepository } from "../dataSources/InMemoryRepository";

export class RepositoryFactory {
  /**
   * Create or retrieve the proper repository instance based on the model's @Repository decorator.
   *
   * @param model The model class constructor.
   * @param dependencies Optional dependencies like DB connection, API clients, etc.
   * @returns IRepository<T> instance matching the model's repository type.
   */
  static create<T>(model: new () => T, dependencies?: any): IRepository<T> {
    const repoType = getRepositoryType(model);

    switch (repoType) {
      case RepositoryType.SQL:
        return new SqlRepository<T>(/* inject dependencies like DB connection */, model);
      case RepositoryType.REST:
        return new RestRepository<T>(/* inject REST client */, model);
      case RepositoryType.INMEMORY:
        return new InMemoryRepository<T>();
      default:
        throw new Error(`Unknown or missing repository type for model ${model.name}`);
    }
  }
}
