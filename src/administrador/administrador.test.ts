import { sum } from "./administrador.controller.js"

test('prueba de test', () =>{
    const result = sum(1, 2)
    expect(result).toBe(3)
})



