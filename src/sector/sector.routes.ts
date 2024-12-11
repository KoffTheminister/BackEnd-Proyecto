import { Router } from "express";
import { get_all, get_one, get_celdas, agregar_sentencia_a_sector } from "./sector.controller.js";

export const sector_router = Router()

sector_router.get('/', get_all)
sector_router.get('/:cod_sector', get_one)
sector_router.get('/celdas/:cod_sector', get_celdas)
sector_router.post('/agregarSentenciasEn:cod_sector', agregar_sentencia_a_sector)


