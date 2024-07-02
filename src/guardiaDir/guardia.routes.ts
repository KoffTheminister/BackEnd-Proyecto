import { Router } from "express";
import { sanitizeGuardiaInput, getAll, getOne } from "./guardia.controller.js";

export const guardiaRouter = Router()

guardiaRouter.get('/', getAll)
guardiaRouter.get(':legajo', getOne)