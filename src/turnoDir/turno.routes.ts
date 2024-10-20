import { Router } from "express";
import { getAll, getFromSector, add, terminarAsignacionDeTurno } from "./turno.controller.js";

export const turnoRouter = Router()

turnoRouter.get('/', getAll)
turnoRouter.get('/:cod_sector', getFromSector)
turnoRouter.post('/', add)
turnoRouter.put('/', terminarAsignacionDeTurno)



