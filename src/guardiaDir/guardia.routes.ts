import { Router } from "express";
import { getAll, getOne, add, finalizarContrato} from "./guardia.controller.js";

export const guardiaRouter = Router()

guardiaRouter.get('/', getAll)
guardiaRouter.get('/:cod_guardia', getOne)
guardiaRouter.post('/', add)
guardiaRouter.put('/finalizarContratoDe:cod_guardia', finalizarContrato)

