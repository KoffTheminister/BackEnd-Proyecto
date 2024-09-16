import { Router } from "express";
import { getOne, getAll, add, inscripcion } from "./actividadIlegal.controller.js"; // , getOne, update, deleteOne, sanitizarInputDeCondena}

export const actividadIlegalRouter = Router()

actividadIlegalRouter.get('/', getAll)
actividadIlegalRouter.get('/:cod_actividad_ilegal', getOne)
actividadIlegalRouter.post('/', add)
actividadIlegalRouter.post('/inscripcion/:cod_act_ilegal&:cod_recluso', inscripcion)