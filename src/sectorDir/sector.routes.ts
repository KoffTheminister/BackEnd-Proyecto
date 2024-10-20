import { Router } from "express";
import { getAll, getOne, agregar_sentencia_a_sector, quitar_sentencia_a_sector } from "./sector.controller.js";

export const sectorRouter = Router()

sectorRouter.get('/', getAll)
sectorRouter.get('/:cod_sector', getOne)
sectorRouter.post('/agregarSentenciasEn:cod_sector', agregar_sentencia_a_sector)
sectorRouter.post('/quitarSentenciasEn:cod_sector', quitar_sentencia_a_sector) //revisar

