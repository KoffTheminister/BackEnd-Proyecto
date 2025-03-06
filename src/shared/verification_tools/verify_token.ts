import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { JwtPayload } from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET as string

export async function verificar_token(req: Request, res: Response, next: NextFunction){
    let token = req.header("Authorization")?.replace('Bearer ', '').trim().replace(/^"|"$/g, '')
    if(!token){
        return res.status(401).json({status: 401, message: 'missing token'})
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {
            cod_administrador: number;
            nombre: string;
            apellido: string;
            dni: string;
            fecha_ini_contrato: string;
            fecha_fin_contrato: string;
            contrasenia: string,
            es_especial: boolean
        };
        req.administrador = {
            cod_administrador: decoded.cod_administrador,
            nombre: decoded.nombre,
            apellido: decoded.apellido,
            dni: decoded.dni,
            fecha_ini_contrato: decoded.fecha_ini_contrato,
            fecha_fin_contrato: decoded.fecha_fin_contrato,
            contrasenia: decoded.contrasenia,
            es_especial: decoded.es_especial
        }
        
        next()
    } catch(error: any){
        console.log(error.message)
        res.status(403).json({status: 403})
    }
}       









