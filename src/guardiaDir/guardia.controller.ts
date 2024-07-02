import { Request, Response, NextFunction } from "express"
import { GuardiaRepository } from "./guardia.repository.js"

function sanitizeGuardiaInput(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        legajo: req.body.legajo
    }

    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

function getAll(req:Request, res:Response){
    res.json({ data: GuardiaRepository.getAll() })
}

export { sanitizeGuardiaInput }