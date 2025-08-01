

import { FilterQuery, FindOptions } from '@mikro-orm/core';

/**
 * Generic repository interface abstracting CRUD and query operations.
 *
 * @template T - Entity type
 */
export interface IRepository<T> {
  /**
   * Begins a transaction if supported by the data source.
   */
  beginTransaction(): Promise<void>;

  /**
   * Commits the current transaction if supported by the data source.
   */
  commitTransaction(): Promise<void>;

  /**
   * Rolls back the current transaction if supported by the data source.
   */
  rollbackTransaction(): Promise<void>;
  /**
   * Bulk create entities.
   * @param dataArr Array of partial entity data.
   * @returns Array of created entities.
   */
  createMany(dataArr: Partial<T>[]): Promise<T[]>;

  /**
   * Bulk update entities by IDs.
   * @param updates Array of { id, data } objects.
   * @returns Array of updated entities (null if not found).
   */
  updateMany(updates: { id: string; data: Partial<T> }[]): Promise<(T | null)[]>;

  /**
   * Bulk delete entities by IDs.
   * @param ids Array of IDs to delete.
   */
  deleteMany(ids: string[]): Promise<void>;
  /**
   * Creates and persists a new entity with the given partial data.
   *
   * @param data - Partial data to create the entity
   * @returns The newly created entity, including generated fields like ID
   */
  create(data: Partial<T>): Promise<T>;

  /**
   * Updates an existing entity identified by its ID with partial data.
   *
   * @param id - The unique identifier of the entity to update
   * @param data - Partial data to update the entity with
   * @returns The updated entity, or null if the entity was not found
   */
  update(id: string, data: Partial<T>): Promise<T | null>;

  /**
   * Deletes the entity identified by the given ID.
   *
   * @param id - The unique identifier of the entity to delete
   */
  delete(id: string): Promise<void>;

  /**
   * Finds an entity by its unique ID.
   *
   * @param id - The unique identifier of the entity
   * @returns The entity if found, or null otherwise
   */
  findById(id: string): Promise<T | null>;

  /**
   * Finds a single entity matching the given filter criteria.
   *
   * @param filters - MikroORM filter query object specifying criteria
   * @returns The first matching entity or null if none match
   */
  findOne(filters: FilterQuery<T>): Promise<T | null>;

  /**
   * Retrieves all entities without filtering.
   *
   * @returns An array of all entities
   */
  findAll(): Promise<T[]>;

  /**
   * Finds multiple entities matching the optional filters,
   * supporting pagination, sorting, and other find options.
   *
   * @param filters - Optional MikroORM filter query specifying matching criteria
   * @param options - Optional MikroORM find options such as limit, offset, orderBy
   * @returns An array of matching entities
   */
  find(filters?: FilterQuery<T>, options?: FindOptions<T>): Promise<T[]>;
}
