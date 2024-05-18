class Price{
    id?: number;
    currencyId: number;
    amount: number; 

    constructor({ id, currencyId, amount }: {
        id?: number,
        currencyId: number,
        amount: number
    }) {
        this.id = id;
        this.currencyId = currencyId;
        this.amount = amount;
    }
}