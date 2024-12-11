import { Router } from "express";
import { get_all, get_one, add, sanitizar_input_de_recluso} from "./recluso.controller.js";

export const recluso_router = Router()

recluso_router.get('/', get_all)
recluso_router.get('/:dni', get_one)
recluso_router.post('/', sanitizar_input_de_recluso, add)

