import { Router } from "express";
import { getAll, getOne, add} from "./guardia.controller.js";

export const guardiaRouter = Router()

guardiaRouter.get('/', getAll)
guardiaRouter.get('/:cod_guardia', getOne)
guardiaRouter.post('/', add)