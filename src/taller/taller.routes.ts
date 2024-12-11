import { Router } from "express";
import { get_one, get_all, add, update, inscripcion, sanitizar_input_de_taller, sanitizar_update_de_taller } from "./taller.controller.js";

export const taller_router = Router()

taller_router.get('/', get_all)
taller_router.get('/:cod_taller', get_one)
taller_router.post('/', sanitizar_input_de_taller, add)
taller_router.post('/inscripcion/:cod_taller&:cod_recluso', inscripcion)
taller_router.put('/:cod_taller', sanitizar_update_de_taller, update)




