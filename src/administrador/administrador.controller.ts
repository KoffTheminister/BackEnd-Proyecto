import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Administrador } from "./administrador.entity.js"

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

async function add(req: Request, res: Response){
    try {
        const el_dni = Number.parseInt(req.body.cod_administrador) 
        const el_admin = await em.findOne(Administrador, { dni: req.body.sanitized_input.dni })
        if(el_admin == null){
            const el_admin = await em.create(Administrador, req.body.sanitized_input)
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
        const elAdmin = await em.findOneOrFail(Administrador, { cod_administrador })
        if(elAdmin.contrasenia === req.body.contrasenia){
            if(elAdmin.cod_administrador === 4){
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

export { get_all, get_one, log_in, add, sanitizar_input_de_administrador }
