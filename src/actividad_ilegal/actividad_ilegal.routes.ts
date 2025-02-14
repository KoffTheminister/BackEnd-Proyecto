import { Router } from "express";
import { get_one, get_all, add, inscripcion, update, sanitizar_input_de_actividad_ilegal, sanitizar_update_de_actividad_ilegal } from "./actividad_ilegal.controller.js";
import { verificar_special_token } from "../shared/verification_tools/verify_special_token.js";

export const actividad_ilegal_router = Router()

actividad_ilegal_router.get('/', verificar_special_token, get_all)
actividad_ilegal_router.get('/:cod_actividad_ilegal', verificar_special_token, get_one)
actividad_ilegal_router.post('/', verificar_special_token, sanitizar_input_de_actividad_ilegal, add)
actividad_ilegal_router.put('/:cod_act_ilegal', verificar_special_token, sanitizar_update_de_actividad_ilegal, update)
actividad_ilegal_router.post('/inscripcion/:cod_act_ilegal&:cod_recluso', verificar_special_token, inscripcion)





