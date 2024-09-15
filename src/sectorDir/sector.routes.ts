import { Router } from "express";
import { getAll, getOne } from "./sector.controller.js";

export const sectorRouter = Router()

sectorRouter.get('/', getAll)
sectorRouter.get('/:cod_sector', getOne)


