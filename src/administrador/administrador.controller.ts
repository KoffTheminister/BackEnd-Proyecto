import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { orm } from "../shared/db/orm.js"
import { Administrador } from "./administrador.entity.js"
import { validar_incoming_administrador } from "./administrador.schema.js"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET as string

const em = orm.em
em.getRepository(Administrador)

const SALT_ROUNDS = 10

async function sanitizar_input_de_administrador(req: Request, res: Response, next: NextFunction){

    req.body.sanitized_input = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        fecha_ini_contrato: new Date(req.body.fecha_ini_contrato),
        contrasenia: req.body.contrasenia,
        es_especial: req.body.es_especial
    }
    
    for (const key of Object.keys(req.body.sanitized_input)){
        if(req.body.sanitized_input[key] === undefined){ //NO cambiar el === a ==
            return res.status(400).json({ status: 400,  message: `Falta el campo ${key}` });
        }
    }
    
    const incoming = await validar_incoming_administrador(req.body.sanitized_input)
        if (!incoming.success){
            console.log(incoming.issues)
            return res.status(400).json({message: incoming.issues[0].message})
        }
    req.body.sanitized_input = incoming.output

    next()
}

async function hash_contra(contrasenia: string){
    return await bcrypt.hash(contrasenia, SALT_ROUNDS);
}

async function add(req: Request, res: Response){
    try {
        const el_dni = Number.parseInt(req.body.cod_administrador) 
        const el_admin = await em.findOne(Administrador, { dni: req.body.sanitized_input.dni })
        if(el_admin == null){
            const el_admin = await em.create(Administrador, req.body.sanitized_input)
            await em.flush()
            el_admin.contrasenia = await hash_contra(req.body.contrasenia)
            await em.flush()
            res.status(201).json({ status: 201, data: el_admin} )
        } else {
            res.status(409).json({ status: 409} )
        }
    } catch (error: any){
        res.status(500).json({ status: 500 } )
    }
}

async function log_in_jwt(req: Request, res: Response){

    try{
        const cod_administrador = Number.parseInt(req.body.cod_administrador) 
        const el_admin = await em.findOne(Administrador, { cod_administrador })
        if(el_admin == null){
            return res.status(404).json({ status: 404 } )
        }

        if(!(await bcrypt.compare(req.body.contrasenia, el_admin.contrasenia))){
            return res.status(409).json({ status: 409})
        }
        
        const token = jwt.sign({
            cod_administrador: el_admin.cod_administrador,
            nombre: el_admin.nombre,
            apellido: el_admin.apellido,
            dni: el_admin.dni,
            fecha_ini_contrato: el_admin.fecha_ini_contrato,
            fecha_fin_contrato: el_admin.fecha_fin_contrato,
            contrasenia: el_admin.contrasenia,
            es_especial: el_admin.es_especial
        }, JWT_SECRET, {expiresIn:'3h'})
        res.status(201).json({status: 201, token: token, es_especial: el_admin.es_especial})
    } catch(error:any){
        console.log(error.message)
        res.status(500).json({ status: 500 } )
    }

}

async function get_all(req:Request, res:Response){
    try{
        const administradores = await em.find(Administrador, {fecha_fin_contrato: null})
        res.status(201).json({ status: 201, data: administradores})
    } catch (error: any) {
        res.status(404).json({  status: 404})
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_administrador =  Number.parseInt(req.params.cod_administrador) 
        const el_admin = await em.findOne(Administrador, { cod_administrador })
        if(el_admin != null){
            res.status(201).json({  status: 201, data: el_admin } )
        } else {
            res.status(404).json({  status: 404 })
        }
        
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}

export { get_all, get_one, log_in_jwt, add, sanitizar_input_de_administrador }

