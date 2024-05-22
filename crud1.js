// fnm -----> gestor de verciones de node 
// pnpm -----> gestor de proyectos 
// nvm -----> gestor de versiones
// node ----> v20.13.1 (Iron)

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

class arrayActividades{
   
}

class Actividad{
    static ultimoCodigo = 0;
    //atributos de instancia: horario, actID, descripcion, diaDeLaSemana y Locacion
    cargaDatos(){
        this.actID = Actividad.ultimoCodigo;
        Actividad.incrementarCodigo();
        this.descripcion = int(prompt('Ingrese la descripcion de la actividad: '));
        lock = false;
        while(lock === false){
            try{
                
                lock = true;
            }catch(err){
                console.log('El dato ingresado no es un numero. Vuelva a ingresar.');
            }
        }
        lock = false;
        while(lock === false){
            try{
                
                lock = true
            }catch(err){
                console.log('El dato ingresado no es un numero. Vuelva a ingresar.');
            }
        } 
    }

    static incrementarCodigo() {
        Actividad.ultimoCodigo += 1;
    }
};

function recorrer_array() {
    
}

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
    console.log("ingrese identificador de la actividad");
    let x = int;
    //recorrer el array, buscar la deseada y cargarla en ENCONTRADA
    console.log("ingrese lo que quiera modificar: (1)horario (2)dia de la semana (3)locacion (4)descripcion")
    switch(x){
        case 1: {}//encontrado.horario = nuevo valor 
        break;
        case 2: {}//encontrado.diaDeLaSemana = nuevo valor
        break;
        case 3: {}//encontrado.Locacion = nuevo valor
        break;
        case 4: {}//encontrado.descripcion = nuevo valor
        break;
    }
    
}
function eliminar_actividad(){

}
function listar_actividad(){

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