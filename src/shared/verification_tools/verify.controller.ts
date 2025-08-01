import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import { JwtPayload } from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET as string

export function verify(req: Request, res: Response){
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
            contrasenia: string,
            es_especial: boolean
        }
        req.administrador = {
            cod_administrador: decoded.cod_administrador,
            nombre: decoded.nombre,
            apellido: decoded.apellido,
            dni: decoded.dni,
            contrasenia: decoded.contrasenia,
            es_especial: decoded.es_especial
        }
        return res.status(200).json({status: 200})
    } catch(error: any){
        //console.log(error.message)
        res.status(403).json({status: 403})
    }
}

export function verify_special(req: Request, res: Response){
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
            contrasenia: string,
            es_especial: boolean
        };
        req.administrador = {
            cod_administrador: decoded.cod_administrador,
            nombre: decoded.nombre,
            apellido: decoded.apellido,
            dni: decoded.dni,
            contrasenia: decoded.contrasenia,
            es_especial: decoded.es_especial
        }
        if(req.administrador.es_especial){
            return res.status(200).json({status: 200})
        } else {
            return res.status(403).json({status: 403})
        }
        
    } catch(error: any){
        //console.log(error.message)
        res.status(403).json({status: 403})
    }
}       
    



