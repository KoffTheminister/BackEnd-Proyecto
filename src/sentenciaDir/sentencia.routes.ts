import { Router } from "express";
import { getAll, getOne, update, add, deleteOne } from "./sentencia.controller.js";

export const sentenciaRouter = Router()

sentenciaRouter.get('/', getAll)
sentenciaRouter.get('/:cod_sentencia', getOne)
sentenciaRouter.post('/', add)
sentenciaRouter.put('/:cod_sentencia', update)
sentenciaRouter.delete('/:cod_sentencia', deleteOne)


