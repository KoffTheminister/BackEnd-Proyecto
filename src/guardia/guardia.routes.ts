import { Router } from "express";
import { get_all, get_one, add, finalizar_contrato, sanitizar_input_de_guardia} from "./guardia.controller.js";

export const guardia_router = Router()

guardia_router.get('/', get_all)
guardia_router.get('/:dni', get_one)
guardia_router.post('/', sanitizar_input_de_guardia, add)
guardia_router.put('/finalizarContrato', finalizar_contrato)

