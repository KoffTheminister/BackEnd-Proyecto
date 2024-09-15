import { Router } from "express";
import { getAll, getOne, add, update, deleteOne, sanitizarInputDeGuardia} from "./guardia.controller.js";

export const guardiaRouter = Router()

guardiaRouter.get('/', getAll)
guardiaRouter.get('/:cod_guardia', getOne)
guardiaRouter.post('/', add) // sanitizarInputDeGuardia, add)
guardiaRouter.put('/:cod_guardia', sanitizarInputDeGuardia, update)
guardiaRouter.delete('/:cod_guardia', deleteOne)


