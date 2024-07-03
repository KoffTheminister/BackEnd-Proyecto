import { Router } from "express";
import { sanitizeGuardiaInput, getAll, getOne, add, update, deleteOne} from "./guardia.controller.js";

export const guardiaRouter = Router()

guardiaRouter.get('/', getAll)
guardiaRouter.get('/:legajo', getOne)
guardiaRouter.post('/', sanitizeGuardiaInput, add)
guardiaRouter.put(':legajo', sanitizeGuardiaInput, update)
guardiaRouter.delete('/:legajo', sanitizeGuardiaInput, deleteOne)