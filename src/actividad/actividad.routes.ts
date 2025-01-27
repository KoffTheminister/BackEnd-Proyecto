import { Router } from "express";
import { get_all, get_one, update, add, sanitizar_input_de_actividad } from "./actividad.controller.js";
import { verificar_token } from "../shared/verify_token.js";

export const actividad_router = Router()

actividad_router.get('/', verificar_token, get_all)
actividad_router.get('/:cod_actividad', verificar_token, get_one)
actividad_router.post('/', verificar_token, sanitizar_input_de_actividad, add)
actividad_router.put('/:cod_actividad', verificar_token, update)


