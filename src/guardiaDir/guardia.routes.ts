import { Router } from "express";
import { getAll, getOne, add, finalizarContrato} from "./guardia.controller.js";

export const guardiaRouter = Router()

guardiaRouter.get('/', getAll)
guardiaRouter.get('/:dni', getOne)
guardiaRouter.post('/', add)
guardiaRouter.put('/finalizarContrato', finalizarContrato)

