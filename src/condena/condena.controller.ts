import { Request, Response, NextFunction} from "express"
import { orm } from "../shared/db/orm.js"
import { Recluso } from "../recluso/recluso.entity.js"
import { Condena } from "./condena.entity.js"
import { Sentencia } from "../sentencia/sentencia.entity.js"
import { buscar_recluso, get_one } from "../recluso/recluso.controller.js"
import { get_sentencias_especificas } from "../sentencia/sentencia.controller.js"
import { get_sectores_con_sentencia } from "../sector/sector.controller.js"

const em = orm.em

async function sanitizar_input_de_condena(req:Request, res:Response, next: NextFunction) {
    const today = new Date();
    const el_recluso_verdadero = await buscar_recluso(req.body.cod_recluso)

    if(el_recluso_verdadero != null && req.body.cod_sentencias.length != 0){
        req.body.sanitized_input = {
            cod_recluso: el_recluso_verdadero,
            fecha_ini: today,
            fecha_fin_estimada: null,
            fecha_fin_real: null,
            //sentencias: req.body.cod_sentencias esto se hace en un metodo de condena
        }
        next()
    } else if (el_recluso_verdadero != null){
        return res.status(400).json({ message: 'el codigo de recluso no coincide con ninguno registrado'})
    } else if (req.body.cod_sentencias.length == 0){
        return res.status(400).json({ message: 'ninguna sentencia fue enviada'})
    }
}

async function get_all(req:Request, res:Response){
    try{
        const condenas = await em.find(Condena, {fecha_fin_real: null}, {populate: ['sentencias']})
        res.status(201).json({ message: 'las condenas:', data: condenas})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}

async function add(req: Request, res: Response){
    try{
        console.log(req.body.sanitized_input)
        const nueva_condena = em.create(Condena, req.body.sanitized_input)
        await em.flush()
        /*
        let auc = await em.getConnection().execute(`insert into condena (cod_recluso_cod_recluso, fecha_ini, fecha_fin_estimada, fecha_fin_real) 
                                                    values (?, ?, ?, ?);`, [req.body.cod_recluso, finalDate, null, null]);
        for (const cod of Object.keys(req.body.cod_sentencias)) {
            await em.getConnection().execute(
                `insert into condena_sentencias (condena_cod_recluso_cod_recluso, condena_fecha_ini, sentencia_cod_sentencia) 
                 values (?, ?, ?);`, 
                [req.body.cod_recluso, finalDate, req.body.cod_sentencias[cod]]
            );
        }
        */
        const mis_sentencias = await get_sentencias_especificas(req.body.cod_sentencias)
        nueva_condena.agregar_sentencias(mis_sentencias, em)
        await em.flush()
        /*
        let max = await em.getConnection().execute(`select max(sen.orden_de_gravedad) as max
                                                    from sentencia sen
                                                    inner join condena_sentencias c_s on c_s.sentencia_cod_sentencia = sen.cod_sentencia
                                                    where c_s.condena_cod_recluso_cod_recluso = ? and condena_fecha_ini = ?;`, [req.body.cod_recluso, finalDate]);
        */
        let orden_max = 0
        let la_sentencia_maxima: Sentencia = mis_sentencias[0]
        let i = 0
        while(i = 0, i < mis_sentencias.length, i++){
            if(mis_sentencias[i].orden_de_gravedad > orden_max){
                orden_max = mis_sentencias[i].orden_de_gravedad
                let la_sentencia_maxima = mis_sentencias[i]
            }
        }
        let los_sectores = await get_sectores_con_sentencia(la_sentencia_maxima)
        /*
        let cod_sentencia = await em.getConnection().execute(`select sen.cod_sentencia as cod
                                                              from sentencia sen
                                                              where sen.orden_de_gravedad = ?;`, [max[0].max]);

        let cod_sector = await em.getConnection().execute(`select c.cod_sector_cod_sector as cod_sector
                                                           from sector_sentencias s_s
                                                           where s_s.sentencia_cod_sentencia = ?
                                                           limit 1;`, [cod_sentencia[0].cod]);
        */
        let j = 0
        let bool = true
        
        while(j = 0, j < los_sectores.length && bool == true, j++){
            if(los_sectores[j].encarcelar_recluso(nueva_condena.cod_recluso) == false){
                bool = false
                await em.flush()
                res.status(201).json({ status: 201 })
            }
        }
        
        /*
        let cod_celdas = await em.getConnection().execute(`select c.cod_celda as cod, c.capacidad, count(e.cod_celda_cod_celda)
                                                           from celda c
                                                           left join estadia e on c.cod_celda = e.cod_celda_cod_celda
                                                           where e.fecha_fin is null and c.cod_sector_cod_sector = ?
                                                           group by c.cod_celda
                                                           having c.capacidad > count(e.cod_celda_cod_celda)
                                                           limit 1;`, [cod_sector[0].cod_sector]);
        let estadia = await em.getConnection().execute(`insert into estadia (cod_recluso_cod_recluso, cod_celda_cod_celda, cod_celda_cod_sector_cod_sector, fecha_ini, fecha_fin)
                                                        values (?, ?, ?, ?, null);`, [req.body.cod_recluso, cod_celdas[0].cod, cod_sector[0].cod_sector, finalDate]);
        */
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function finalizar_condenas(req:Request, res:Response){
    try{
        const today = new Date();
        const condenas = await em.find(
            Condena, 
            {fecha_fin_real: null, fecha_fin_estimada: { $lt: today }}, 
            //{ populate: ['cod_recluso'] } tiraba error
        )
        let reclusos:any = []
        let i = 0
        while(i = 0, i < condenas.length, i++){
            reclusos.push(condenas[i].cod_recluso)
            condenas[i].fecha_fin_real = today
            condenas[i].cod_recluso.celda = null
        }

        /*
        let condenas = await em.getConnection().execute(
            `select *
            from condena
            where fecha_fin_estimada <= curdate() and fecha_fin_real is null;`);
        */

        if(condenas.length != 0){
            /*
            let reclusos_a_liberar = await em.getConnection().execute(
                `update condena
                set fecha_fin_real = curdate()
                where fecha_fin_estimada <= curdate();`);
            */
            res.status(201).json({ data: reclusos })

            let i = 0
            while(i = 0, i < condenas.length, i++){
                condenas[i].cod_recluso.celda = null
            }
        } else {
            res.status(404).json({ message: 'no se tienen que terminar condenas'})
        }
    } catch (error: any) {
        res.status(400).json({ message: 'error'})
    }
}

export { get_all, add, finalizar_condenas, sanitizar_input_de_condena }








