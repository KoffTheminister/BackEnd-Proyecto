import { Router } from "express";
import { getAll, getOne, update, add, deleteOne, sanitizarInputDeSentencia } from "./sentencia.controller.js";

export const sentenciaRouter = Router()

sentenciaRouter.get('/', getAll)
sentenciaRouter.get('/:cod_sentencia', getOne)
sentenciaRouter.post('/', sanitizarInputDeSentencia, add)
sentenciaRouter.put('/:cod_sentencia', sanitizarInputDeSentencia, update)
sentenciaRouter.delete('/:cod_sentencia', deleteOne)


