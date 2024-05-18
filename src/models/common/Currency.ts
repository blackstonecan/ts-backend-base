class Currency{
    id?: number;
    name: string;
    symbol: string;
    shortage: string;

    constructor({ id, name, symbol, shortage }: {
        id?: number,
        name: string,
        symbol: string,
        shortage: string
    }) {
        this.id = id;
        this.name = name;
        this.symbol = symbol;
        this.shortage = shortage;
    }
}