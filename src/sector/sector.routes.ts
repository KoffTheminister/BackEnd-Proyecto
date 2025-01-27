import { Router } from "express";
import { get_all, get_one, get_celdas, agregar_sentencia_a_sector } from "./sector.controller.js";
import { verificar_token } from "../shared/verify_token.js";

export const sector_router = Router()

sector_router.get('/', verificar_token, get_all)
sector_router.get('/:cod_sector', verificar_token, get_one)
sector_router.get('/celdas/:cod_sector', verificar_token, get_celdas)
sector_router.post('/agregarSentencias', verificar_token, agregar_sentencia_a_sector)

