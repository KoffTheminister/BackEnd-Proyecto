import { Router } from "express";
import { getOne, getAll, add, update, inscripcion, sanitizarInputDeTaller } from "./taller.controller.js"; // , getOne, update, deleteOne, sanitizarInputDeCondena}

export const tallerRouter = Router()

tallerRouter.get('/', getAll)
tallerRouter.get('/:cod_taller', getOne)
tallerRouter.post('/', sanitizarInputDeTaller, add)
tallerRouter.post('/inscripcion/:cod_taller&:cod_recluso', inscripcion)
tallerRouter.put('/:cod_taller', sanitizarInputDeTaller, update)



