import axios from "axios";
import { IRepository } from "../core/IRepository";
import type { FilterQuery, FindOptions } from '@mikro-orm/core';

/**
 * RESTRepository<T>
 * 
 * A generic repository implementation that performs CRUD operations
 * by interacting with a REST API endpoint.
 * 
 * This class implements the IRepository interface, allowing
 * Slingr services to use REST APIs as a data source transparently.
 * 
 * @template T - The entity type managed by this repository.
 */
export class RestRepository<T> implements IRepository<T> {
  /**
   * @param baseUrl The base URL of the REST API resource endpoint,
   * e.g., "https://api.example.com/users"
   */
  constructor(private baseUrl: string) { }
    
  /**
   * Bulk create entities by sending a POST request with an array of data.
   * @param dataArr Array of partial entity data.
   * @returns Array of created entities from the server response.
   */
  async createMany(dataArr: Partial<T>[]): Promise<T[]> {
    const response = await axios.post<T[]>(this.baseUrl + '/bulk', dataArr);
    return response.data;
  }

  /**
   * Bulk update entities by sending a PUT request with an array of updates.
   * @param updates Array of { id, data } objects.
   * @returns Array of updated entities (null if not found).
   */
  async updateMany(updates: { id: string; data: Partial<T> }[]): Promise<(T | null)[]> {
    const response = await axios.put<T[]>(this.baseUrl + '/bulk', updates);
    return response.data;
  }

  /**
   * Bulk delete entities by sending a DELETE request with an array of IDs.
   * @param ids Array of IDs to delete.
   */
  async deleteMany(ids: string[]): Promise<void> {
    await axios.request({
      url: this.baseUrl + '/bulk',
      method: 'DELETE',
      data: ids
    });
  }


  /**
   * Create a new entity by sending a POST request with the data.
   * @param data Partial data to create the entity.
   * @returns The created entity from the server response.
   */
  async create(data: Partial<T>): Promise<T> {
    const response = await axios.post<T>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing entity by sending a PUT request to the URL with the entity ID.
   * @param id The entity ID.
   * @param data Partial data to update.
   * @returns The updated entity from the server response.
   */
  async update(id: string, data: Partial<T>): Promise<T | null> {
    const response = await axios.put<T>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete an entity by sending a DELETE request to the URL with the entity ID.
   * @param id The entity ID.
   */
  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Retrieve a single entity by sending a GET request to the URL with the entity ID.
   * @param id The entity ID.
   * @returns The entity or null if not found.
   */
  async findById(id: string): Promise<T | null> {
    const response = await axios.get<T>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Find a single entity matching the given filters.
   * @param filters Filter criteria to match.
   * @returns The first matching entity or null if none match.
   */
  async findOne(filters: FilterQuery<T>): Promise<T | null> {
    const response = await axios.get<T[]>(this.baseUrl, { params: filters });
    return response.data[0] ?? null;
  }

  /**
   * Find all entities.
   * @returns An array of all entities.
   */
  async findAll(): Promise<T[]> {
    const response = await axios.get<T[]>(this.baseUrl);
    return response.data;
  }

  /**
   * Find multiple entities matching the optional filters and options.
   * @param filters Optional filter criteria to match.
   * @param options Optional find options such as limit, offset, orderBy.
   * @returns An array of matching entities.
   */
  async find(filters?: FilterQuery<T>, options?: FindOptions<T>): Promise<T[]> {
    // This assumes the API supports query params for filters/options
    const params: any = { ...filters };
    if (options?.limit) params.limit = options.limit;
    if (options?.offset) params.offset = options.offset;
    if (options?.orderBy) params.orderBy = options.orderBy;
    const response = await axios.get<T[]>(this.baseUrl, { params });
    return response.data;
  }

  /**
   * Begins a transaction if supported by the data source.
   */
  beginTransaction(): Promise<void> {
    throw new Error("Operation not supported.");
  }

  /**
   * Commits a transaction if supported by the data source.
   */
  commitTransaction(): Promise<void> {
    throw new Error("Operation not supported.");
  }

  /**
   * Rolls back a transaction if supported by the data source.
   */
  rollbackTransaction(): Promise<void> {
    throw new Error("Operation not supported.");
  }

}
