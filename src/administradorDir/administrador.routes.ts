import { Router } from "express";
import { getAll, getOne, logIn, update, deleteOne, sanitizarInputDeAdministrador} from "./administrador.controller.js";

export const administradorRouter = Router()

console.log('estoy en routes admin')
administradorRouter.get('/', getAll)
administradorRouter.get('/:cod_administrador', getOne)
administradorRouter.post('/logIn', logIn)
administradorRouter.put('/:cod_administrador', sanitizarInputDeAdministrador, update)
administradorRouter.delete('/:cod_administrador', deleteOne)


