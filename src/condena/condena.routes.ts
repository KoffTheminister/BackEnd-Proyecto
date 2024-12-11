import { Router } from "express";
import { get_all, add, finalizar_condenas, sanitizar_input_de_condena} from "./condena.controller.js";

export const condena_router = Router()

condena_router.get('/', get_all)
condena_router.post('/', sanitizar_input_de_condena, add)
condena_router.get('/finalizar_condenas', finalizar_condenas)

