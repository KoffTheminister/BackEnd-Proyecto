import { Router } from "express";
import { get_all, get_one} from "./celda.controller.js";

export const celda_router = Router()

celda_router.get('/', get_all)
celda_router.get('/:cod_celda', get_one)

