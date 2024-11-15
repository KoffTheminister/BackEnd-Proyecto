import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Condena } from "./condena.entity.js"

const em = orm.em
em.getRepository(Condena)

async function getAll(req:Request, res:Response){
    try{
        const condenas = await em.find(Condena, {})
        res.status(201).json({ message: 'las condenas:', data: condenas})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}

async function add(req: Request, res: Response){
    try{
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        let year = today.getFullYear();
        let finalDate = `${year}-${month}-${day}`
        console.log(req.body)
        let auc = await em.getConnection().execute(`insert into condena (cod_recluso_cod_recluso, fecha_ini, fecha_fin_estimada, fecha_fin_real) 
                                                    values (?, ?, ?, ?);`, [req.body.cod_recluso, finalDate, null, null]);
        await em.flush()

        for (const cod of Object.keys(req.body.cod_sentencias)) {
            await em.getConnection().execute(
                `insert into condena_sentencias (condena_cod_recluso_cod_recluso, condena_fecha_ini, sentencia_cod_sentencia) 
                 values (?, ?, ?);`, 
                [req.body.cod_recluso, finalDate, req.body.cod_sentencias[cod]]
            );
        }

        let max = await em.getConnection().execute(`select max(sen.orden_de_gravedad) as max
                                                    from sentencia sen
                                                    inner join condena_sentencias c_s on c_s.sentencia_cod_sentencia = sen.cod_sentencia
                                                    where c_s.condena_cod_recluso_cod_recluso = ? and condena_fecha_ini = ?;`, [req.body.cod_recluso, finalDate]);

        let cod_sentencia = await em.getConnection().execute(`select sen.cod_sentencia as cod
                                                              from sentencia sen
                                                              where sen.orden_de_gravedad = ?;`, [max[0].max]);
        console.log(cod_sentencia)
        let cod_sector = await em.getConnection().execute(`select c.cod_sector_cod_sector as cod_sector
                                                           from sector_sentencias s_s
                                                           inner join celda c on s_s.sector_cod_sector = c.cod_sector_cod_sector
                                                           where s_s.sentencia_cod_sentencia = ?
                                                           limit 1;`, [cod_sentencia[0].cod]);
        console.log(cod_sector)
        let cod_celdas = await em.getConnection().execute(`select c.cod_celda as cod, c.capacidad, count(e.cod_celda_cod_celda)
                                                           from celda c
                                                           left join estadia e on c.cod_celda = e.cod_celda_cod_celda
                                                           where e.fecha_fin is null and c.cod_sector_cod_sector = ?
                                                           group by c.cod_celda
                                                           having c.capacidad > count(e.cod_celda_cod_celda)
                                                           limit 1;`, [cod_sector[0].cod_sector]);
        console.log(cod_celdas)
        let estadia = await em.getConnection().execute(`insert into estadia (cod_recluso_cod_recluso, cod_celda_cod_celda, cod_celda_cod_sector_cod_sector, fecha_ini, fecha_fin)
                                                        values (?, ?, ?, ?, null);`, [req.body.cod_recluso, cod_celdas[0].cod, cod_sector[0].cod_sector, finalDate]);
        await em.flush()
        res.status(201).json({ status: 201 })
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function finalizarCondenas(req:Request, res:Response){
    try{
        let condenas = await em.getConnection().execute(
            `select *
            from condena
            where fecha_fin_estimada <= curdate() and fecha_fin_real is null;`);
        if(condenas.length !== 0){
            let estadias_a_terminar = await em.getConnection().execute(
                `update estadia
                set fecha_fin = curdate()
                where cod_recluso_cod_recluso in (select cod_recluso_cod_recluso from condena where fecha_fin_estimada <= curdate() and fecha_fin_real is null);`);
            let condenass = await em.getConnection().execute(
                `update condena
                set fecha_fin_real = curdate()
                where fecha_fin_estimada <= curdate();`);
            res.status(201).json({ data: condenas })
        } else {
            res.status(404).json({ message: 'no se tienen que terminar condenas'})
        }
    } catch (error: any) {
        res.status(400).json({ message: 'error'})
    }
}

export { getAll, add, finalizarCondenas }








