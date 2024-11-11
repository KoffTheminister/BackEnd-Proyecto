import { Router } from "express";
import { getAll, add, finalizarCondenas } from "./condena.controller.js";

export const condenaRouter = Router()

condenaRouter.get('/', getAll)
condenaRouter.post('/', add) // sanitizarInputDeCondena, add)
condenaRouter.get('/finalizarCondenas', finalizarCondenas)

