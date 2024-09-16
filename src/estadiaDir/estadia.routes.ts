import { Router } from "express";
import { getAll, getOne, add } from "./estadia.controller.js";

export const estadiaRouter = Router()

estadiaRouter.get('/', getAll)
estadiaRouter.get('/:cod_recluso', getOne)
estadiaRouter.post('/', add)



