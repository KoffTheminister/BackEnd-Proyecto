import { Router } from "express";
import { get_all, get_one, add, sanitizar_input_de_sentencia } from "./sentencia.controller.js";
import { verificar_token } from "../shared/verification_tools/verify_token.js";

export const sentencia_router = Router()

sentencia_router.get('/', verificar_token, get_all)
sentencia_router.get('/:cod_sentencia', verificar_token, get_one)
sentencia_router.post('/', verificar_token, sanitizar_input_de_sentencia, add)




