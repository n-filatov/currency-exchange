import {Currency} from "../../model/currency.model";
import {getConvertCurrency} from "../../api/convert/convert.api";
import {createDomain} from "effector";
import {useStore} from "effector-react";

type TransferCurrencyService = {
    exchangeCurrency(params: { fromCurrency: Currency, toCurrency: Currency, amount: number }): Promise<unknown>,
    fromCurrency: Currency | null,
    toCurrency: Currency | null,
    exchangeRate: number | null,
    amount: number | null
}

const exchangeCurrencyDomain = createDomain('exchangeCurrency');

const $fromCurrency = exchangeCurrencyDomain.createStore<null | Currency>(null);
const $toCurrency = exchangeCurrencyDomain.createStore<null | Currency>(null);
const $exchangeRate = exchangeCurrencyDomain.createStore<null | number>(null);
const $fromAmount = exchangeCurrencyDomain.createStore<null | number>(null);

const exchangeCurrencyFx = exchangeCurrencyDomain.createEffect(async function exchangeCurrency(params: Parameters<TransferCurrencyService['exchangeCurrency']>[0]) {
    return await getConvertCurrency({
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency
    })
})

$fromCurrency.on(exchangeCurrencyFx.done, (state, data) => {
    return data.result.from
})

$toCurrency.on(exchangeCurrencyFx.done, (state, data) => {
    return data.result.to
})

$exchangeRate.on(exchangeCurrencyFx.done, (state, data) => {
    return data.result.rate
})

$fromAmount.on(exchangeCurrencyFx.done, (state, data) => {
    return data.params.amount
})


export function useTransferCurrency(): TransferCurrencyService {
    const fromCurrency = useStore($fromCurrency);
    const toCurrency = useStore($toCurrency);
    const exchangeRate = useStore($exchangeRate)
    const amount = useStore($fromAmount)

    return {
        exchangeCurrency: exchangeCurrencyFx,
        fromCurrency,
        toCurrency,
        exchangeRate,
        amount
    }
}