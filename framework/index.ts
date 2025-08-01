export * from './core/IRepository';
export * from './core/BaseService';
export * from './dataSources/InMemoryRepository';
export * from './dataSources/RestRepository';
export * from './dataSources/SqlRepository';
export * from './database/bootstrap';

// Optionally, export decorators if you want to expose them
// export * from './decorators/Entity';
// export * from './decorators/Field';
// ...

import { initializeDataSource, orm, em } from './database/bootstrap';

/**
 * Initializes the framework (database, etc). Call this before using repositories/services.
 * Returns the MikroORM instance and EntityManager.
 */
export async function initFramework() {
    await initializeDataSource();
    return { orm, em };
}
