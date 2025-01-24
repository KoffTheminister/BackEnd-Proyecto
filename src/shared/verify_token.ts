import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "./configjwt.js"


export async function verificar_token(req: Request, res: Response, next: NextFunction){
    let token = req.header("Authorization")?.replace('Bearer', '')
    if(!token){
        res.status(401).json({status: 401})
        return
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {cod: number;}
        req.administrador = {
            cod_administrador: decoded.cod_administrador,
            nombre: decoded.nombre,
            apellido: decoded.apellido,
            dni: decoded.dni,
            fecha_ini_contrato: decoded.fecha_ini_contrato,
            fecha_fin_contrato: decoded.fecha_fin_contrato,
            contrasenia: req.body.contrasenia
        }
        
        next()
    } catch(error: any){
        res.status(401).json({status: 401})
    }
}





