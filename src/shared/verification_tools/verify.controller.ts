import { Request, Response } from "express"
import { verificar_token } from "./verify_token.js"
import { verificar_special_token } from "./verify_special_token.js"

export function verify(req: Request, res: Response){
    verificar_token(req, res, undefined)
}

export function verify_special(req: Request, res: Response){
    verificar_special_token(req, res, undefined)
}       
    



