import "reflect-metadata";

export enum RepositoryType {
  SQL = "sql",
  REST = "rest",
  INMEMORY = "inmemory",
}

export interface RepositoryMetadata {
  type: RepositoryType;
  db?: string; // Only for SQL type
}

/**
 * Class decorator to mark a model/entity with repository metadata.
 * For SQL type, allows specifying a database name/key.
 * @param metadata - Object containing repository type and optional db (for SQL).
 */
export function Repository(metadata: RepositoryMetadata) {
  return function (target: Function) {
    if (metadata.type === RepositoryType.SQL && metadata.db) {
      Reflect.defineMetadata("repository:config", metadata, target);
    } else {
      Reflect.defineMetadata("repository:type", metadata.type, target);
    }
  };
}

/**
 * Helper to read repository metadata from a class.
 * @param target The class constructor.
 * @returns The repository type or config for SQL, or undefined.
 */
export function getRepositoryConfig(target: Function): RepositoryMetadata | RepositoryType | undefined {
  return Reflect.getMetadata("repository:config", target) ?? Reflect.getMetadata("repository:type", target);
}
