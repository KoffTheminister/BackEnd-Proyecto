/* fnm -----> gestor de verciones de node 
 pnpm -----> gestor de proyectos 
 node ----> v20.13.1 (Iron) */

//librerias y modulos
const readline = require('readline');

//misc
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


//clases
class recluso{
    legajo = 0;
    nombre = "juan perez"
    apellido = "perez"
    estado = true

    
}

let arrayActividades = [];
   

class Actividad{
    static ultimoCodigo = 0;
    //atributos de instancia: horario, actID, descripcion, diaDeLaSemana y Locacion
    cargaDatos(){
        let lock;
        this.actID = Actividad.ultimoCodigo;
        Actividad.incrementarCodigo();
        this.descripcion = (prompt('Ingrese la descripcion de la actividad: ')).toLowerCase();
        lock = false;
        while(lock === false){
            if(this.descripcion == 'lunes'||this.descripcion == 'martes'||this.descripcion == 'miercoles'||this.descripcion == 'jueves'||this.descripcion == 'viernes'||this.descripcion == 'sabado'||this.descripcion == 'domingo'){
                lock = true;
            }else{
                console.log('Dia inexistente, intente con dias de la semana como lunes, martes, etc');
            }
        }
        lock = false;
    }

    static incrementarCodigo() {
        Actividad.ultimoCodigo += 1;
    }
};


function crear_actividad(){
    let nuevaAct = new Actividad; 
    nuevaAct.cargaDatos();
    actividadChequeo = chequearArray(arrayActividades,nuevaAct.descripcion,descripcion);
    if(actividadChequeo == undefined){
        arrayActividades[cont] = nuevaAct;
        cont= cont + 1;
    }else{
        console.log('La actividad ingresada ya se encuentra guardada.');
    }
}


function modificar_actividad(){
    do{
        console.log("ingrese identificador de la actividad o salir(0)");
        let x = prompt();
        encontrado = arrayActividades.find((element) => element.actID === x);
    }while(encontrado === undefined || x == 0)
    console.log("ingrese lo que quiera modificar: (1)horario (2)dia de la semana (3)locacion (4)descripcion")
    if(encontrado !== undefined){
        switch(x){
            case 1: {encontrado.horario = prompt("ingrese el Nuevo horario")}  
                break;
            case 2: {encontrado.diaDeLaSemana = prompt("ingrese el NUEVO dia de la semana")}
                break;
            case 3: {encontrado.Locacion = prompt("ingrese la NUEVA locacion")}
                break;
            case 4: {encontrado.descripcion = prompt("ingrese la NUEVA descripcion")}
                break;
            }}
    
}
function eliminar_actividad(){

}
function listar_actividad(){
    if(arrayActividades.length === 0){
        arrayActividades.forEach((element) => console.log(element));
    }else{
        console.log("no hay actividades ingresadas")
    }
}

//menu principal
let bandera=1;
let cont=0;
let list = new listado; 
while(bandera !== 0){
    console.log("---Ingrese 1 opcion: (1)agendar una actividad (2)modificar una actividad (3)eliminar una actividad (4)listado de actividades (0)salir---)");
    let opcion=0;//tiene que ingresar la opcion por teclado 
    switch(opcion){
        case 1: crear_actividad()
        //crear un nuevo objeto actividad 
            break;
        case 2:modificar_actividad()
        // buscar en el array de actividad y modificar la que ingrese con un identificador   
            break;
        case 3:eliminar_actividad()
         //buscar la actividad con el identificador y eliminarla del array
            break;
        case 4:listar_actividad()
         //recorrer el array con todas las actividades
            break;
        case 0: bandera = 0
            break;
        
    }
}