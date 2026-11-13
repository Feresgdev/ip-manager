import { Router } from "express";
import IpCrowlerRepository from "./ip-crowler.repository";
import { AppDataSource } from "../../config/database.config";
import IpCrowlerService from "./ip-crowler.service";
import IpCrowlerController from "./ip-crowler.controller";

const router = Router();
const ipCrowlerRepo = new IpCrowlerRepository(AppDataSource);
const ipCrowlerService = new IpCrowlerService(ipCrowlerRepo);

const ipCrowlerController = new IpCrowlerController(ipCrowlerService);

export default router;
