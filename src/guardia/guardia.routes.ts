import { Router } from "express";
import { get_all, get_one, add, finalizar_contrato} from "./guardia.controller.js";

export const guardia_router = Router()

guardia_router.get('/', get_all)
guardia_router.get('/:dni', get_one)
guardia_router.post('/', add)
guardia_router.put('/finalizarContrato', finalizar_contrato)

