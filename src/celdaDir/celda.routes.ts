import { Router } from "express";
import { getAll, getOne, getFromSector} from "./celda.controller.js";

export const celdaRouter = Router()

celdaRouter.get('/', getAll)
celdaRouter.get('/:cod_celda', getOne)
celdaRouter.get('/buscarPorSector/:cod_sector', getFromSector)



