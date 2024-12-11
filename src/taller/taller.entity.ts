import { Entity, PrimaryKey, Property, ManyToMany, Cascade, Collection } from "@mikro-orm/core";
import { Recluso } from "../recluso/recluso.entity.js";

@Entity()
export class Taller {
    @PrimaryKey({ nullable: false, unique: true, autoincrement: true})
    cod_taller ?: number  // el !: significa que esta propiedad no puede ser nula
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: true})
    descripcion ?: string

    @Property({ nullable: false})
    locacion !: string

    @Property({ nullable: false})
    dia_de_la_semana !: number  // no vamos a guardar el nombre del dia de la semana, hay que transformarlo siempre y no tiene sentido. pero si vamos a mantener el numero
    
    @Property({ nullable: false})
    hora_inicio !: number

    @Property({ nullable: false})
    hora_fin !: number

    @Property({nullable: false})
    estado !: 1

    @ManyToMany(() => Recluso, (recluso) => recluso.talleres, { unique : false, nullable : false, cascade: [Cascade.ALL], owner: true})
    reclusos = new Collection<Recluso>(this);
    //reclusos !: Recluso[]
}   


