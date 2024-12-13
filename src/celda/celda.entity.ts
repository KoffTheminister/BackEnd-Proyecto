import { Entity, PrimaryKey, Property, Rel, ManyToOne, PrimaryKeyProp, OneToMany, Cascade, Collection} from "@mikro-orm/core";
import { Sector } from "../sector/sector.entity.js";
import { update } from "../actividad_ilegal/actividad_ilegal.controller.js";
import { Recluso } from "../recluso/recluso.entity.js";

@Entity()
export class Celda {
    @PrimaryKey({ nullable: false, unique: true, autoincrement: true})
    cod_celda !: number

    @ManyToOne(() => Sector, { nullable: false, primary : true })
    cod_sector !: Rel<Sector>
    
    @Property({ nullable: false})
    descripcion !: string 
    
    @Property({ nullable: false})
    capacidad !: number
    
    @OneToMany(() => Recluso, (recluso) => recluso.celda, { unique : false, nullable : true, cascade: [Cascade.PERSIST]})
    reclusos = new Collection<Recluso>(this);

    [PrimaryKeyProp] !: ['cod_celda', 'cod_sector'];
    /*
    tengo_disponibilidad(){
        if(this.reclusos.length < this.capacidad){
            return true
        } else {
            return false
        }
    }

    conseguir_reclusos_con_edad(edad_minima: number){
        let r = 0
        let reclusos_habiles : any[] = []
        while(r = 0, r < this.reclusos.length, r++){
            const today = new Date()
            let anios = today.getFullYear() - this.reclusos[r].fecha_nac.getFullYear();
            if(anios >= edad_minima){
                reclusos_habiles.push(this.reclusos[r])
            }
        }
        return reclusos_habiles
    }

    encarcelar_recluso(un_recluso: Recluso){
        if(this.capacidad > this.reclusos.length){
            this.reclusos.add(un_recluso)
            return true
        } else {
            return false
        }
    }
    */
}   





