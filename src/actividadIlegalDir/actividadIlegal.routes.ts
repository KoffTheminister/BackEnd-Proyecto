import { Router } from "express";
import { getOne, getAll, add, inscripcion, update } from "./actividadIlegal.controller.js"; // , getOne, update, deleteOne, sanitizarInputDeCondena}

export const actividadIlegalRouter = Router()

actividadIlegalRouter.get('/', getAll)
actividadIlegalRouter.get('/:cod_actividad_ilegal', getOne)
actividadIlegalRouter.post('/', add)
actividadIlegalRouter.put('/:cod_act_ilegal', update)
actividadIlegalRouter.post('/inscripcion/:cod_act_ilegal&:cod_recluso', inscripcion)

