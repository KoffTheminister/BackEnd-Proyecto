//import { get_one } from '/home/tenet7750/tpdesarrollobe/dist/administrador/administrador.controller.js';


export function sum(a: number, b: number) {
    return a + b
}


test('prueba de test', () =>{
    const result = sum(1, 2)
    expect(result).toBe(3)
})



