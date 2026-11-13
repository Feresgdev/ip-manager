import { DataSource } from "typeorm";

const SCHEMA = "public";

export default class SystemRepository {
  constructor(private readonly dataSource: DataSource) {}

  private qualified(table: string) {
    return `"${SCHEMA}"."${table.replace(/"/g, '""')}"`;
  }

  async listTables(): Promise<string[]> {
    const rows: { table_name: string }[] = await this.dataSource.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = $1 AND table_type = 'BASE TABLE'`,
      [SCHEMA],
    );
    return rows.map((r) => r.table_name);
  }

  async truncateTable(table: string): Promise<void> {
    await this.dataSource.query(
      `TRUNCATE TABLE ${this.qualified(table)} RESTART IDENTITY CASCADE`,
    );
  }

  async dropTable(table: string): Promise<void> {
    await this.dataSource.query(
      `DROP TABLE IF EXISTS ${this.qualified(table)} CASCADE`,
    );
  }

  async dropTables(tables: string[]): Promise<void> {
    const list = tables.map((t) => this.qualified(t)).join(", ");
    await this.dataSource.query(`DROP TABLE IF EXISTS ${list} CASCADE`);
  }
}
