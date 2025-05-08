import { Router } from "express";
import { get_all, add, finalizar_condenas, sanitizar_input_de_condena} from "./condena.controller.js";
import { verificar_token } from "../shared/verification_tools/verify_token.js";

export const condena_router = Router()

condena_router.get('/', verificar_token, get_all)
condena_router.post('/', verificar_token, sanitizar_input_de_condena, add)
condena_router.patch('/finalizar_condenas', verificar_token, finalizar_condenas)


