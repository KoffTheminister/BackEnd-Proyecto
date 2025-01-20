import { Entity, PrimaryKey, Property, ManyToMany, Cascade, OneToMany } from "@mikro-orm/core";
import { Sentencia } from "../sentencia/sentencia.entity.js";
import { Collection } from "@mikro-orm/core";
import { Celda } from "../celda/celda.entity.js";
import { Recluso } from "../recluso/recluso.entity.js";
import { Guardia } from "../guardia/guardia.entity.js";

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

    @ManyToMany(() => Guardia, (guardia) => guardia.cod_sector_m)
    guardias_m = new Collection<Guardia>(this)

    @ManyToMany(() => Guardia, (guardia) => guardia.cod_sector_t)
    guardias_t = new Collection<Guardia>(this)

    @ManyToMany(() => Guardia, (guardia) => guardia.cod_sector_n)
    guardias_n = new Collection<Guardia>(this)

    public agregar_sentencias(unas_sentencias: Sentencia[]){
        /*
        let sentencias_agregadas = new Collection<Sentencia>(this);
        this.sentencias.init()
        unas_sentencias.forEach(una_sentencia => {
            this.sentencias.add(una_sentencia)
            //em.flush()
            
            try{
                this.sentencias.add(una_sentencia)
                em.flush()
                sentencias_agregadas.add(una_sentencia)
            }catch(error: any){

            }
            
        })
        */
    
        let sentencias_agregadas = new Collection<Sentencia>(this);
        unas_sentencias.forEach(una_sentencia => {
            let i = 0
            let ok = true
            while(i = 0, i < this.sentencias.length && ok == true, i++){
                console.log('holi')
                if(una_sentencia == this.sentencias[i]){
                    ok = false
                }
            }
            if(ok == true){
                this.sentencias.add(una_sentencia)
                sentencias_agregadas.add(una_sentencia)
            }
        })
        return sentencias_agregadas
        
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
    
    public conseguir_reclusos_con_edad(edad_minima: number){
        
        let c = 0
        let reclusos_habiles : any[] = []
        while(c = 0, c < this.celdas.length, c++){
            let reclusos_habiles = this.celdas[c].conseguir_reclusos_con_edad(edad_minima)
            if(reclusos_habiles != null){
                reclusos_habiles.push(...reclusos_habiles)
            }
        }

        return reclusos_habiles
        
    }
    
    public encarcelar_recluso(un_recluso: Recluso){

        let c = 0
        let bool = true
        while(c = 0, c < this.celdas.length && bool == true, c++){
            if(this.celdas[c].encarcelar_recluso(un_recluso) == true){
                bool = false
            }
        }
        return bool
        
    }
    
}
