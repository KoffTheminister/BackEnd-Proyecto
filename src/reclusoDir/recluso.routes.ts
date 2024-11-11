import { Router } from "express";
import { getAll, getOne, add, sanitizarInputDeRecluso} from "./recluso.controller.js";

export const reclusoRouter = Router()

reclusoRouter.get('/', getAll)
reclusoRouter.get('/:dni', getOne)
reclusoRouter.post('/', add)

