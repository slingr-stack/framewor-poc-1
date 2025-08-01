import { IRepository } from "../core/IRepository";
import { EntityManager, EntityName, FindOptions } from "@mikro-orm/core";

/**
 * SqlRepository<T>
 *
 * A repository implementation using MikroORM to perform CRUD operations
 * on a SQL database.
 *
 * This class implements the IRepository<T> interface, allowing Slingr
 * services to abstract away the database layer and work seamlessly
 * with MikroORM-managed entities.
 *
 * @template T - The entity type managed by this repository. Must have an optional 'id' property.
 */
export class SqlRepository<T extends { id?: string }> implements IRepository<T> {
  
  private em: EntityManager;
  private entityClass: EntityName<T>;

  /**
   * Bulk create entities in the database.
   * @param dataArr Array of partial entity data.
   * @returns Array of created entities.
   */
  async createMany(dataArr: Partial<T>[]): Promise<T[]> {
    const entities = dataArr.map(data => this.em.create(this.entityClass, data as any));
    await this.em.persistAndFlush(entities);
    return entities;
  }

  /**
   * Bulk update entities by IDs.
   * @param updates Array of { id, data } objects.
   * @returns Array of updated entities (null if not found).
   */
  async updateMany(updates: { id: string; data: Partial<T> }[]): Promise<(T | null)[]> {
    const results: (T | null)[] = [];
    for (const { id, data } of updates) {
      const entity = await this.em.findOne(this.entityClass, { id } as any);
      if (!entity) {
        results.push(null);
        continue;
      }
      this.em.assign(entity, data as any);
      results.push(entity);
    }
    await this.em.persistAndFlush(results.filter(e => e));
    return results;
  }

  /**
   * Bulk delete entities by IDs.
   * @param ids Array of IDs to delete.
   */
  async deleteMany(ids: string[]): Promise<void> {
    const entities = await this.em.find(this.entityClass, { id: { $in: ids } } as any);
    await this.em.removeAndFlush(entities);
  }


  /**
   * Constructs a new SqlRepository for a given entity class.
   *
   * @param em - MikroORM EntityManager instance.
   * @param entityClass - The class/constructor of the entity.
   */
  constructor(em: EntityManager, entityClass: EntityName<T>) {
    this.em = em;
    this.entityClass = entityClass;
  }
  /**
   * Finds a single entity by its ID.
   *
   * @param id - The unique identifier of the entity.
   * @returns Promise resolving to the entity or null if not found.
   */
  async findById(id: string): Promise<T | null> {
    return this.em.findOne(this.entityClass, { id } as any);
  }

  /**
   * Finds a single entity matching the provided filters.
   *
   * @param filters - An object representing the filter criteria.
   * @returns Promise resolving to the entity or null if not found.
   */
  async findOne(filters: Partial<T>): Promise<T | null> {
    return this.em.findOne(this.entityClass, filters as any);
  }

  /**
   * Finds all entities in the database.
   *
   * @returns Promise resolving to an array of all entities.
   */
  async findAll(): Promise<T[]> {
    return this.em.find(this.entityClass, {});
  }

  /**
   * Finds entities matching the provided filters and options.
   *
   * @param filters - An object representing the filter criteria.
   * @param options - Optional query options (e.g., pagination, sorting).
   * @returns Promise resolving to an array of matching entities.
   */
  async find(filters?: Partial<T>, options?: FindOptions<T>): Promise<T[]> {
    return this.em.find(this.entityClass, filters as any, options);
  }

  /**
   * Creates and persists a new entity record in the database.
   *
   * @param data - Partial entity data to create.
   * @returns Promise resolving to the saved entity.
   */
  async create(data: Partial<T>): Promise<T> {
    const entity = this.em.create(this.entityClass, data as any);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  /**
   * Updates an existing entity record identified by ID.
   *
   * @param id - The unique identifier of the entity to update.
   * @param data - Partial data to update the entity with.
   * @returns Promise resolving to the updated entity or null if not found.
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const entity = await this.em.findOne(this.entityClass, { id } as any);
    if (!entity) {
      return null;
    }
    this.em.assign(entity, data as any);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  /**
   * Deletes an entity record identified by ID.
   *
   * @param id - The unique identifier of the entity to delete.
   */
  async delete(id: string): Promise<void> {
    const entity = await this.em.findOne(this.entityClass, { id } as any);
    if (entity) {
      await this.em.removeAndFlush(entity);
    }
  }

  /**
   * Begins a transaction using MikroORM's transaction API.
   */
  async beginTransaction(): Promise<void> {
    await this.em.begin();
  }

  /**
   * Commits the current transaction using MikroORM's transaction API.
   */
  async commitTransaction(): Promise<void> {
    await this.em.commit();
  }

  /**
   * Rolls back the current transaction using MikroORM's transaction API.
   */
  async rollbackTransaction(): Promise<void> {
    await this.em.rollback();
  }
}
