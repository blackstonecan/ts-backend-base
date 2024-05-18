class Country{
    id?: number;
    name: string;
    code: number;
    flag: string;

    constructor({id, name, code, flag}: {
        id?: number;
        name: string;
        code: number;
        flag: string;
    
    }){
        this.id = id;
        this.name = name;
        this.code = code;
        this.flag = flag;
    }
}

export default Country;