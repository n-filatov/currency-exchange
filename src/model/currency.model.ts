export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    Unknown = 'Unknown'
}

export type ExchangeScheme = {
    from: Currency
    to: Currency
    rate: number
}