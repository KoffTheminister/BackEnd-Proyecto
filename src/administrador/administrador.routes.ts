import { Router } from "express";
import { get_all, get_one, log_in_jwt, sanitizar_input_de_administrador, add} from "./administrador.controller.js";
import { verificar_token } from "../shared/verify_token.js";

export const administrador_router = Router()

administrador_router.get('/', verificar_token, get_all)
administrador_router.get('/:cod_administrador', verificar_token, get_one)
administrador_router.post('/', sanitizar_input_de_administrador, add)
//administrador_router.post('/logIn', log_in) 
administrador_router.post('/logIn', log_in_jwt)// el verificar_token NO va en el log in



