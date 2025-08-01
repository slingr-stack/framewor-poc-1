import { IRepository } from "../core/IRepository";
import { randomUUID } from "crypto";
import type { FilterQuery, FindOptions } from '@mikro-orm/core';

/**
 * InMemoryRepository<T>
 * 
 * A simple in-memory repository implementation.
 * 
 * Useful for tests, demos, or dev mode. Stores entities in an internal array.
 * 
 * @template T - The entity type managed by this repository.
 */
export class InMemoryRepository<T extends { id?: string }> implements IRepository<T> {

  // For transaction simulation
  private transactionStack: T[][] = [];

  /**
   * Begin a transaction (simulated for in-memory store).
   */
  async beginTransaction(): Promise<void> {
    this.transactionStack.push([...this.store]);
  }

  /**
   * Commit a transaction (simulated for in-memory store).
   */
  async commitTransaction(): Promise<void> {
    this.transactionStack.pop();
  }

  /**
   * Rollback a transaction (simulated for in-memory store).
   */
  async rollbackTransaction(): Promise<void> {
    if (this.transactionStack.length > 0) {
      this.store = this.transactionStack.pop()!;
    }
  }
  private store: T[] = [];
  /**
   * Bulk create entities.
   * @param dataArr Array of partial entity data.
   * @returns Array of created entities.
   */
  async createMany(dataArr: Partial<T>[]): Promise<T[]> {
    const created: T[] = [];
    for (const data of dataArr) {
      created.push(await this.create(data));
    }
    return created;
  }

  /**
   * Bulk update entities by IDs.
   * @param updates Array of { id, data } objects.
   * @returns Array of updated entities (null if not found).
   */
  async updateMany(updates: { id: string; data: Partial<T> }[]): Promise<(T | null)[]> {
    return Promise.all(updates.map(u => this.update(u.id, u.data)));
  }

  /**
   * Bulk delete entities by IDs.
   * @param ids Array of IDs to delete.
   */
  async deleteMany(ids: string[]): Promise<void> {
    this.store = this.store.filter((item) => !ids.includes(item.id as string));
  }

  /**
   * Create a new entity and assign a unique ID if not present.
   * @param data - Partial entity data.
   * @returns The created entity.
   */
  async create(data: Partial<T>): Promise<T> {
    const entity: T = {
      ...data,
      id: (data.id ?? randomUUID()) as string,
    } as T;
    this.store.push(entity);
    return entity;
  }

  /**
   * Update an entity by ID.
   * @param id - ID of entity to update.
   * @param data - Partial data to merge.
   * @returns The updated entity or null.
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const index = this.store.findIndex((item) => item.id === id);
    if (index === -1) return null;
    this.store[index] = { ...this.store[index], ...data };
    return this.store[index];
  }

  /**
   * Delete an entity by ID.
   * @param id - ID of entity to delete.
   */
  async delete(id: string): Promise<void> {
    this.store = this.store.filter((item) => item.id !== id);
  }

  /**
   * Get a single entity by ID.
   * @param id - ID of entity to find.
   * @returns The entity or null.
   */
  async findById(id: string): Promise<T | null> {
    return this.store.find((item) => item.id === id) ?? null;
  }

  /**
   * Find a single entity matching the given filters.
   * @param filters Filter criteria to match.
   * @returns The first matching entity or null if none match.
   */
  async findOne(filters: FilterQuery<T>): Promise<T | null> {
    return this.store.find((item) => this.matchesFilter(item, filters)) ?? null;
  }

  /**
   * Find all entities.
   * @returns An array of all entities.
   */
  async findAll(): Promise<T[]> {
    return [...this.store];
  }

  /**
   * Find multiple entities matching the optional filters and options.
   * @param filters Optional filter criteria to match.
   * @param options Optional find options such as limit, offset, orderBy.
   * @returns An array of matching entities.
   */
  async find(filters?: FilterQuery<T>, options?: FindOptions<T>): Promise<T[]> {
    let results = filters ? this.store.filter((item) => this.matchesFilter(item, filters)) : [...this.store];
    // options: limit, offset, orderBy
    if (options?.orderBy) {
      const [[key, dir]] = Object.entries(options.orderBy);
      results = results.sort((a, b) => {
        if (a[key] < b[key]) return dir === 'ASC' ? -1 : 1;
        if (a[key] > b[key]) return dir === 'ASC' ? 1 : -1;
        return 0;
      });
    }
    if (options?.offset) results = results.slice(options.offset);
    if (options?.limit) results = results.slice(0, options.limit);
    return results;
  }

  private matchesFilter(item: T, filters: FilterQuery<T>): boolean {
    return Object.entries(filters).every(([k, v]) => (item as any)[k] === v);
  }

}
