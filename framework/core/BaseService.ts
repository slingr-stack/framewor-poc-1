import { IRepository } from "./IRepository.ts";
import { validateOrReject } from "class-validator";
import type { FilterQuery, FindOptions } from '@mikro-orm/core';

/**
 * Generic CRUD service, designed to work with any data source
 * that implements the IRepository interface.
 * Supports lifecycle hooks and automatic validation using class-validator.
 *
 * @template T - The entity type managed by the service. Must optionally have an 'id' property.
 */
export abstract class BaseService<T extends { id?: string }> {
  protected repo: IRepository<T>;
  protected entity: new () => T;

  constructor(repo: IRepository<T>, entity: new () => T) {
    this.repo = repo;
    this.entity = entity;
  }

  /**
   * Create a new entity record.
   * Runs the `beforeCreate` and `afterCreate` hooks.
   *
   * @param data Partial data to create the entity.
   * @returns The created and saved entity.
   * @throws Validation errors if validation fails in beforeCreate.
   */
  async create(data: Partial<T>): Promise<T> {
    await this.beforeCreate?.(data);
    const instance = await this.repo.create(data);
    await this.afterCreate?.(instance);
    return instance;
  }

  /**
   * Update an existing entity by ID.
   * Runs the `beforeUpdate` and `afterUpdate` hooks.
   *
   * @param id The ID of the entity to update.
   * @param data Partial data to update.
   * @returns The updated entity or null if not found.
   * @throws Validation errors if validation fails in beforeUpdate.
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    await this.beforeUpdate?.(id, data);
    const updated = await this.repo.update(id, data);
    await this.afterUpdate?.(updated);
    return updated;
  }

  /**
   * Delete an entity by ID.
   * Runs the `beforeDelete` and `afterDelete` hooks.
   *
   * @param id The ID of the entity to delete.
   */
  async delete(id: string): Promise<void> {
    await this.beforeDelete?.(id);
    await this.repo.delete(id);
    await this.afterDelete?.(id);
  }

  /**
   * Find an entity by ID.
   *
   * @param id The ID of the entity to find.
   * @returns The found entity or null if not found.
   */
  async findById(id: string): Promise<T | null> {
    return this.repo.findById(id);
  }

  /**
   * Find a single entity matching the given filters.
   *
   * @param filters Filter criteria to match.
   * @returns The first matching entity or null if none match.
   */
  async findOne(filters: FilterQuery<T>): Promise<T | null> {
    return this.repo.findOne(filters);
  }

  /**
   * Retrieve all entities.
   *
   * @returns An array of all entities.
   */
  async findAll(): Promise<T[]> {
    return this.repo.findAll();
  }

  /**
   * Find multiple entities matching the optional filters and options.
   *
   * @param filters Optional filter criteria to match.
   * @param options Optional find options such as limit, offset, orderBy.
   * @returns An array of matching entities.
   */
  async find(filters?: FilterQuery<T>, options?: FindOptions<T>): Promise<T[]> {
    return this.repo.find(filters, options);
  }


  // ------------------------------
  // Lifecycle hooks — override as needed in subclasses
  // Default implementations perform class-validator validation
  // ------------------------------

  /**
   * Hook executed before creating an entity.
   * By default, performs validation using class-validator.
   *
   * @param data Partial entity data to be created.
   * @throws Validation errors if entity is invalid.
   */
  async beforeCreate(data: Partial<T>): Promise<void> {
    const instance = Object.assign(new this.entity(), data);
    await validateOrReject(instance);
  }

  /**
   * Hook executed after creating an entity.
   *
   * @param entity The newly created entity instance.
   */
  async afterCreate(entity: T): Promise<void> {}

  /**
   * Hook executed before updating an entity.
   * By default, performs validation using class-validator.
   *
   * @param id ID of the entity to update.
   * @param data Partial data to update.
   * @throws Validation errors if updated entity is invalid.
   */
  async beforeUpdate(id: string, data: Partial<T>): Promise<void> {
    const instance = Object.assign(new this.entity(), data);
    await validateOrReject(instance);
  }

  /**
   * Hook executed after updating an entity.
   *
   * @param entity The updated entity or null if not found.
   */
  async afterUpdate(entity: T | null): Promise<void> {}

  /**
   * Hook executed before deleting an entity.
   *
   * @param id ID of the entity to delete.
   */
  async beforeDelete(id: string): Promise<void> {}

  /**
   * Hook executed after deleting an entity.
   *
   * @param id ID of the deleted entity.
   */
  async afterDelete(id: string): Promise<void> {}
}
