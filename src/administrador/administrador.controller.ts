import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Administrador } from "./administrador.entity.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { JWT_SECRET } from "../shared/configjwt.js"


const em = orm.em
em.getRepository(Administrador)

function sanitizar_input_de_administrador(req: Request, res: Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        fecha_ini_contrato: req.body.fecha_ini_contrato,
        fecha_fin_contrato: req.body.fecha_fin_contrato,
        contrasenia: req.body.contrasenia
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
        if(req.body.sanitized_input[key] === undefined){
            delete req.body.sanitized_input[key]
            return res.status(400).json({message: 'a field is missing'})
        }
    })
    next()
}

async function hash_contra(contrasenia: string){
    const salt_rounds = 10
    const hashed_contra = await bcrypt.hash(contrasenia, salt_rounds);
    return hashed_contra
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

async function log_in(req: Request, res: Response){
    try {
        const cod_administrador = Number.parseInt(req.body.cod_administrador) 
        const el_admin = await em.findOneOrFail(Administrador, { cod_administrador })
        if(el_admin.contrasenia === req.body.contrasenia){
            if(el_admin.dni == 66666666){
                res.status(202).json({ status: 202} )
            } else {
                res.status(201).json({  status: 201 } )
            }
        } else {
            res.status(401).json({ status: 401} )
        }
    } catch (error: any){
        res.status(404).json({ status: 404 } )
    }
}

async function log_in_jwt(req: Request, res: Response){
    try{
        const cod_administrador = Number.parseInt(req.body.cod_administrador) 
        const el_admin = await em.findOneOrFail(Administrador, { cod_administrador })
        //const el_admin_data = el_admin.?toJSON()
        if(el_admin == null){
            return res.status(404).json({ status: 404 } )
        }

        //const valid_contra = await bcrypt.compare(req.body.contresenia, el_admin.contrasenia)
        if(!(await bcrypt.compare(req.body.contrasenia, el_admin.contrasenia))){
            return res.status(409).json({ status: 409})
        }
        console.log('aqui')
        const token = jwt.sign({
            cod_administrador: el_admin.cod_administrador,
            nombre: el_admin.nombre,
            apellido: el_admin.apellido,
            dni: el_admin.dni,
            fecha_ini_contrato: el_admin.fecha_ini_contrato,
            fecha_fin_contrato: el_admin.fecha_fin_contrato,
            contrasenia: el_admin.contrasenia
        }, JWT_SECRET, {expiresIn:'3h'})
        res.json(token)
    } catch(error:any){
        console.log(error.message)
        res.status(500).json({ status: 500 } )
    }

}

async function get_all(req:Request, res:Response){
    try{
        const administradores = await em.find(Administrador, {fecha_fin_contrato: null})
        //const administradores = await em.getConnection().execute(`select * from administrador admin where admin.fecha_fin_contrato is null;`);
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

export { get_all, get_one, log_in, log_in_jwt, add, sanitizar_input_de_administrador }
