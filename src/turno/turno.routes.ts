import { Router } from "express";
import { get_from_sector, add_turno, end_turno, sanitizar_input_de_turno } from "./turno.controller.js";

export const turno_router = Router()

turno_router.get('/:cod_sector', get_from_sector)
turno_router.post('/', sanitizar_input_de_turno, add_turno)
turno_router.put('/', sanitizar_input_de_turno, end_turno)


