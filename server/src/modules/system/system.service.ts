import { ForbiddenError, NotFoundError } from "../../global/errors";
import { logger } from "../../config/logger.config";
import SystemRepository from "./system.repository";

// TypeORM's own bookkeeping tables: dropping them loses your migration history
const PROTECTED_TABLES = ["migrations", "typeorm_metadata"];

export default class SystemService {
  constructor(private readonly repository: SystemRepository) {}

  private async validate(tables: string[]): Promise<string[]> {
    const unique = [...new Set(tables)];

    const existing = new Set(await this.repository.listTables());
    const unknown = unique.filter((t) => !existing.has(t));
    if (unknown.length) {
      throw new NotFoundError(`Unknown table(s): ${unknown.join(", ")}`);
    }

    const blocked = unique.filter((t) => PROTECTED_TABLES.includes(t));
    if (blocked.length) {
      throw new ForbiddenError(`Protected table(s): ${blocked.join(", ")}`);
    }

    return unique;
  }

  async clearTable(table: string) {
    const [name] = await this.validate([table]);
    await this.repository.truncateTable(name);
    logger.warn({ table: name }, "Table data deleted (TRUNCATE CASCADE)");
    return { table: name };
  }

  async dropTable(table: string) {
    const [name] = await this.validate([table]);
    await this.repository.dropTable(name);
    logger.warn({ table: name }, "Table dropped (DROP CASCADE)");
    return { table: name };
  }

  async dropTables(tables: string[]) {
    const names = await this.validate(tables);
    await this.repository.dropTables(names);
    logger.warn({ tables: names }, "Tables dropped (DROP CASCADE)");
    return { tables: names };
  }
}
