import { Router } from "express";
import { get_all, get_one, get_celdas, agregar_sentencia_a_sector, get_from_sector, add_turno, end_turno, sanitizar_input_de_turno, sanitizar_input_de_terminar_asignacion } from "./sector.controller.js";

export const sector_router = Router()

sector_router.get('/', get_all)
sector_router.get('/:cod_sector', get_one)
sector_router.get('/celdas/:cod_sector', get_celdas)
sector_router.post('/agregarSentenciasEn:cod_sector', agregar_sentencia_a_sector)
sector_router.get('/turnos/:cod_sector', get_from_sector)
sector_router.post('/turnos', sanitizar_input_de_turno, add_turno)
sector_router.put('/turnos', sanitizar_input_de_terminar_asignacion, end_turno)



