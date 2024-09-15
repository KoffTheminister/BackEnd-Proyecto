import { Router } from "express";
import { getOne, getAll, add } from "./actividadIlegal.controller.js"; // , getOne, update, deleteOne, sanitizarInputDeCondena}

export const actividadIlegalRouter = Router()

actividadIlegalRouter.get('/', getAll)
// condenaRouter.get('/:cod_condena', getOne)
actividadIlegalRouter.post('/', add) // sanitizarInputDeCondena, add)
// condenaRouter.put('/:cod_condena', sanitizarInputDeCondena, update)
// condenaRouter.delete('/:cod_condena', deleteOne)


