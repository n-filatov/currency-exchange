export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    BTC = 'BTC',
    JPY = 'JPY',
    Unknown = 'Unknown'
}

export type ExchangeScheme = {
    from: Currency
    to: Currency
    rate: number
}

export type ExchangeRateHistoryItem = {
    date: Date;
    rate: number;
}