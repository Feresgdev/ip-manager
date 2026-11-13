import "reflect-metadata";
import dotenv from "dotenv";
import path from "node:path";
import { DataSource } from "typeorm";

// root .env for local CLI use; in Docker the vars are already injected
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["src/modules/**/*.entity.ts"],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
});
