import { Router } from "express";
import { getAll, getOne, add, sanitizarInputDeRecluso} from "./recluso.controller.js";

export const reclusoRouter = Router()

reclusoRouter.get('/', getAll)
reclusoRouter.get('/:cod_recluso', getOne)
reclusoRouter.post('/', add)

