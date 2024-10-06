import { Router } from "express";
import { getAll, getOne, add, deleteOne, sanitizarInputDeSentencia } from "./sentencia.controller.js";

export const sentenciaRouter = Router()

sentenciaRouter.get('/', getAll)
sentenciaRouter.get('/:cod_sentencia', getOne)
sentenciaRouter.post('/', sanitizarInputDeSentencia, add)
sentenciaRouter.delete('/:cod_sentencia', deleteOne)


