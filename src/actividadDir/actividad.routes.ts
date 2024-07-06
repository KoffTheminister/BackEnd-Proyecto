import { Router } from "express";
import { sanitizarInputDeActividad, getAll, getOne, update, add, deleteOne } from "./actividad.controller.js";

export const actividadRouter = Router()

actividadRouter.get('/', getAll)
actividadRouter.get('/:actId', getOne)
actividadRouter.post('/', sanitizarInputDeActividad, add)
actividadRouter.put('/:actId', sanitizarInputDeActividad, update)
actividadRouter.delete('/:actId', sanitizarInputDeActividad, deleteOne)