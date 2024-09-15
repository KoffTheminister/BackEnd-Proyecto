import { Router } from "express";
import { getOne, getAll, add } from "./taller.controller.js"; // , getOne, update, deleteOne, sanitizarInputDeCondena}

export const tallerRouter = Router()

tallerRouter.get('/', getAll)
// condenaRouter.get('/:cod_condena', getOne)
tallerRouter.post('/', add) // sanitizarInputDeCondena, add)
// condenaRouter.put('/:cod_condena', sanitizarInputDeCondena, update)
// condenaRouter.delete('/:cod_condena', deleteOne)


