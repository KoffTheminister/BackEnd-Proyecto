import { Router } from "express";
import { get_all, get_one, update, add, sanitizar_input_de_actividad } from "./actividad.controller.js";

export const actividad_router = Router()

actividad_router.get('/', get_all)
actividad_router.get('/:cod_actividad', get_one)
actividad_router.post('/', add) // sanitizarInputDeActividad, add)
actividad_router.put('/:cod_actividad', sanitizar_input_de_actividad, update)


