import {Currency, ExchangeScheme} from "../../../model/currency.model";
import {baseExchangeUrl} from "../exchange.api";

const mapCurrencyToRaw = (currency: Currency): string => {
    const mapper = {
        [Currency.EUR]: 'EUR',
        [Currency.USD]: 'USD',
        [Currency.BTC]: 'BTC',
        [Currency.JPY]: 'JPY',
        [Currency.Unknown]: 'unknown'
    }

    return mapper[currency] ?? ''
}

const mapRawCurrency = (raw: string): Currency => {
    switch (raw) {
        case 'EUR':
            return Currency.EUR;
        case 'USD':
            return Currency.USD;
        case 'BTC':
            return Currency.BTC;
        case 'JPY':
            return Currency.JPY;
        default:
            return Currency.Unknown;
    }
}

type RawExchangeResult = {
    query: {
        from: string,
        to: string,
        amount: number
    },
    info: {
        rate: number
    }
}

const mapRawExchangeResult = (rawResult: RawExchangeResult): ExchangeScheme => {
    return {
        from: mapRawCurrency(rawResult.query.from),
        to: mapRawCurrency(rawResult.query.to),
        rate: rawResult.info.rate
    }
}

export const getConvertCurrency = async (params: { fromCurrency: Currency, toCurrency: Currency }) => {
    const response = await fetch(`${baseExchangeUrl}/convert?from=${mapCurrencyToRaw(params.fromCurrency)}&to=${mapCurrencyToRaw(params.toCurrency)}`)
    const result = await response.json();

    return mapRawExchangeResult(result);
}