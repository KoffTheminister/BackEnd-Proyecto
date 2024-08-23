import { Cascade, Entity, ManyToMany,  ManyToOne,  PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { Recluso } from "../reclusoDir/recluso.entity.js";
import { Guardia } from "../guardiaDir/guardia.entity.js";


@Entity()
export class Actividad {
    @PrimaryKey({ nullable: false, unique: true})
    cod_actividad !: number  // el !: significa que esta propiedad no puede ser nula
    
    @Property({ nullable: false})
    nombre !: string 

    @Property({ nullable: true})
    descripcion ?: string

    @Property({ nullable: false})
    locacion !: string

    @Property({ nullable: false})
    diaDeLaSemana !: number  // no vamos a guardar el nombre del dia de la semana, hay que transformarlo siempre y no tiene sentido. pero si vamos a mantener el numero
    
    @Property({ nullable: false})
    horaInicio !: number

    @Property({ nullable: false})
    horaFin !: number

    @ManyToMany(() => Recluso, Recluso => Recluso.actividades, {
        cascade : [Cascade.ALL], 
        owner : true   // siempre debe haber un lado owner, el lado owner especifica desde donde se cargan los datos en este caso los reclusos se cargan desde actividad
    })
    reclusos ?: Recluso[]  // del lado owner siempre va como array
                           // aunque diga recluso, en realidad guardamos los codigos (ids)

    @ManyToOne(() => Guardia, { nullable: true})
    miGuardia ?: Rel<Guardia>  // debemos poner esta notacion siempre desde el lado many
}   









