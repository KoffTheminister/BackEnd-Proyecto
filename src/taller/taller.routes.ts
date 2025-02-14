import { Router } from "express";
import { get_one, get_all, add, update, inscripcion, sanitizar_input_de_taller, sanitizar_update_de_taller } from "./taller.controller.js";
import { verificar_token } from "../shared/verification_tools/verify_token.js";

export const taller_router = Router()

taller_router.get('/', verificar_token, get_all)
taller_router.get('/:cod_taller', verificar_token, get_one)
taller_router.post('/', verificar_token, sanitizar_input_de_taller, add)
taller_router.post('/inscripcion/:cod_taller&:cod_recluso', verificar_token, inscripcion)
taller_router.put('/:cod_taller', verificar_token, sanitizar_update_de_taller, update)





