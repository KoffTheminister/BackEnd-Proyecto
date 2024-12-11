import { Router } from "express";
import { get_all, get_from_sector, add, terminar_asignacion_de_turno, sanitizar_input_de_turno, sanitizar_input_de_terminar_asignacion } from "./turno.controller.js";

export const turno_router = Router()

turno_router.get('/', get_all)
turno_router.get('/:cod_sector', get_from_sector)
turno_router.post('/', sanitizar_input_de_turno, add)
turno_router.put('/', sanitizar_input_de_terminar_asignacion, terminar_asignacion_de_turno)



