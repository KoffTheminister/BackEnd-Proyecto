import { Entity, PrimaryKey, Property, ManyToMany, Cascade, OneToMany, ConstraintViolationException } from "@mikro-orm/core";
import { Sentencia } from "../sentencia/sentencia.entity.js";
import { Collection } from "@mikro-orm/core";
import { Celda } from "../celda/celda.entity.js";
import { Recluso } from "../recluso/recluso.entity.js";
import { Turno } from "../turno/turno.entity.js";
import { EntityManager } from "@mikro-orm/mysql";

@Entity()
export class Sector {
    @PrimaryKey({ nullable: false, unique: true})
    cod_sector !: number

    @Property({ nullable: false, unique: true})
    nombre !: string

    @Property({ nullable: false, unique: false})
    descripcion !: string
    
    @ManyToMany(() => Sentencia, (sentencia) => sentencia.sectores, { unique : false, nullable : false, cascade: [Cascade.CANCEL_ORPHAN_REMOVAL, Cascade.PERSIST, Cascade.MERGE ], owner: true})
    sentencias = new Collection<Sentencia>(this);

    @OneToMany(() => Celda, (celda) => celda.cod_sector, { unique : false, nullable : false, cascade: [Cascade.ALL]})
    celdas = new Collection<Celda>(this);

    @OneToMany(() => Turno, (turno) => turno.cod_sector)
    turnos = new Collection<Turno>(this)

    async agregar_sentencias(unas_sentencias: Sentencia[], em: EntityManager){
        let i = 0;
        while (i < unas_sentencias.length) {
            try {
                if(!(this.sentencias.contains(unas_sentencias[i]))){
                    this.sentencias.add(unas_sentencias[i])
                    await em.flush();
                    i++
                } else {
                    unas_sentencias.splice(i, 1)
                }
            } catch (error: any) {
                console.log(error.message)
            }
        }
        return unas_sentencias
    }

    public conseguir_celda_libre(){
        
        let b = true
        let i = 0
        while(i = 0, i < this.celdas.length && b == true, i++){
            if(this.celdas[i].tengo_disponibilidad() == true){
                return this.celdas[i]
            }
        }
        return null
        
    }
    
    async conseguir_reclusos_con_edad(edad_minima: number){
        
        let c = 0
        let reclusos_habiles : any[] = []
        while(c < this.celdas.length){
            let reclusos_habiles_celda = await this.celdas[c].conseguir_reclusos_con_edad(edad_minima)
            if(reclusos_habiles_celda != null){
                reclusos_habiles.push(...reclusos_habiles_celda)
            }
            c++
        }
        return reclusos_habiles
        
    }
    
    async encarcelar_recluso(un_recluso: Recluso, em: EntityManager){

        let c = 0
        let bool = true
        while(c < this.celdas.length && bool == true){
            if(await this.celdas[c].encarcelar_recluso(un_recluso, em) == true){
                bool = false
            }
            c++
        }
        return bool
        
    }
    
}
