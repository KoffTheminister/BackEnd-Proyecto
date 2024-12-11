import { Router } from "express";
import { get_all, get_one, add, sanitizar_input_de_sentencia } from "./sentencia.controller.js";

export const sentencia_router = Router()

sentencia_router.get('/', get_all)
sentencia_router.get('/:cod_sentencia', get_one)
sentencia_router.post('/', sanitizar_input_de_sentencia, add)



