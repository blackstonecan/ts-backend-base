class District{
    id?: number;
    name: string;
    cityId: number;
    postalCode: string;

    constructor({id, name, cityId, postalCode}: {
        id?: number;
        name: string;
        cityId: number;
        postalCode: string;
    
    }){
        this.id = id;
        this.name = name;
        this.cityId = cityId;
        this.postalCode = postalCode;
    }
}

export default District;