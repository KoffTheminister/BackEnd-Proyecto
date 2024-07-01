export interface Repository<T> { // <T> is the generics declaration, it specifies what type will entities stored in the repo be
    getAll(): T[] | undefined,
    getOne(id: string): T | undefined, // {id: string} by writing this we stablish that anything can be sent, whoever it will only work for entities that contain a property called id
    add(item: T): T | undefined,
    update(item: T, id: string): number //T | undefined, 
    deleteOne(id: string): string | undefined
}
