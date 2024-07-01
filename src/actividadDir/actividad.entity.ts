//import crypto from 'node:crypto'

export class Actividad{
    constructor(
        public descripcion : string, 
        public diaSemana : number, 
        public horaMinutoComienzo : string,
        public horaMinutoFin : string,
        public locacion : string,
        //public actID = crypto.randomUUID(),  //wwwewrwr-2534-1541-jnk7-1b3lmn6338ub  8 letras - 4 numeros - 4 numeros - 3 letras 1 numero - numero letra numero 3 letras 4 numeros 2 letras
        // es mejor que el DAO se encargue del id, de todas maneras lo dejamos como alternativa
        //public my42?: string,
        //public something: partial<anothersomethoin> & {id:stirng}  //mantiene dentro de character ciertos datos de un objeto de anothersomethoin y debe tener si o si el id o los atributos especificados en el {}
    ){}
    idsDeReclusos = []
}
