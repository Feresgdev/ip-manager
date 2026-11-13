import { DataSource } from "typeorm";

export default class IpCrowlerRepository {
  constructor(private readonly dataSource: DataSource) {}
}
