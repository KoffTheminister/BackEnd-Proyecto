export interface Repository<T> { 
    getAll(): Promise <T[] | undefined>,
    getOne(id: string): Promise <T | undefined>, 
    add(item: T): Promise <T | undefined>,
    update(item: Partial <T>, id: string): Promise <T | undefined>,
    deleteOne(id: string): Promise <string> 
}

