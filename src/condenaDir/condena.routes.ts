import { Router } from "express";
import { getAll, add } from "./condena.controller.js"; // , getOne, update, deleteOne, sanitizarInputDeCondena}

export const condenaRouter = Router()

condenaRouter.get('/', getAll)
// condenaRouter.get('/:cod_condena', getOne)
condenaRouter.post('/', add) // sanitizarInputDeCondena, add)
// condenaRouter.put('/:cod_condena', sanitizarInputDeCondena, update)
// condenaRouter.delete('/:cod_condena', deleteOne)


