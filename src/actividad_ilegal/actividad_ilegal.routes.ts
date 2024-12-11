import { Router } from "express";
import { get_one, get_all, add, inscripcion, update } from "./actividad_ilegal.controller.js";

export const actividad_ilegal_router = Router()

actividad_ilegal_router.get('/', get_all)
actividad_ilegal_router.get('/:cod_actividad_ilegal', get_one)
actividad_ilegal_router.post('/', add)
actividad_ilegal_router.put('/:cod_act_ilegal', update)
actividad_ilegal_router.post('/inscripcion/:cod_act_ilegal&:cod_recluso', inscripcion)




