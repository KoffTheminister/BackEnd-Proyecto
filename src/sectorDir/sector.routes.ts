import { Router } from "express";
import { getAll, getOne, getCeldas, agregar_sentencia_a_sector } from "./sector.controller.js";

export const sectorRouter = Router()

sectorRouter.get('/', getAll)
sectorRouter.get('/:cod_sector', getOne)
sectorRouter.get('/celdas/:cod_sector', getCeldas)
sectorRouter.post('/agregarSentenciasEn:cod_sector', agregar_sentencia_a_sector)


