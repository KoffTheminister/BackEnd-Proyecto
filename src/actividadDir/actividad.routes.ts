import { Router } from "express";
import { getAll, getOne, update, add, sanitizarInputDeActividad } from "./actividad.controller.js";

export const actividadRouter = Router()

actividadRouter.get('/', getAll)
actividadRouter.get('/:cod_actividad', getOne)
actividadRouter.post('/', add) // sanitizarInputDeActividad, add)
actividadRouter.put('/:cod_actividad', sanitizarInputDeActividad, update)


