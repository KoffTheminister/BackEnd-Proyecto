import { Router } from "express";
import { get_all, get_one, log_in, sanitizar_input_de_administrador} from "./administrador.controller.js";

export const administrador_router = Router()

administrador_router.get('/', get_all)
administrador_router.get('/:cod_administrador', get_one)
administrador_router.post('/logIn', log_in)


