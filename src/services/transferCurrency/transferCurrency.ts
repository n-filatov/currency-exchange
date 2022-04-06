import {Currency, ExchangeRateHistoryItem} from "../../model/currency.model";
import {getConvertCurrency} from "../../api/exchange/convert/convert.api";
import {createDomain} from "effector";
import {useStore} from "effector-react";
import {getTimeSeriesData} from "../../api/exchange/timeseries/timeseries.api";

type TransferCurrencyService = {
    exchangeCurrency(params: { fromCurrency: Currency, toCurrency: Currency, amount: number }): Promise<unknown>,
    fromCurrency: Currency | null,
    toCurrency: Currency | null,
    exchangeRate: number | null,
    amount: number | null,
    timeSeriesHistory: ExchangeRateHistoryItem[]
}

const exchangeCurrencyDomain = createDomain('exchangeCurrency');

const $fromCurrency = exchangeCurrencyDomain.createStore<null | Currency>(null);
const $toCurrency = exchangeCurrencyDomain.createStore<null | Currency>(null);
const $exchangeRate = exchangeCurrencyDomain.createStore<null | number>(null);
const $fromAmount = exchangeCurrencyDomain.createStore<null | number>(null);
const $timeSeriesHistory = exchangeCurrencyDomain.createStore<ExchangeRateHistoryItem[]>([]);

const exchangeCurrencyFx = exchangeCurrencyDomain.createEffect(async function exchangeCurrency(params: Parameters<TransferCurrencyService['exchangeCurrency']>[0]) {
    const [currencyResult, timeSeries] = await Promise.all([getConvertCurrency({
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency
    }), getTimeSeriesData({
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency
    })])

    return {
        ...currencyResult,
        timeSeries
    }
})

$timeSeriesHistory.on(exchangeCurrencyFx.done, (state, data) => {
    return data.result.timeSeries
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
    const exchangeRate = useStore($exchangeRate);
    const amount = useStore($fromAmount);
    const timeSeriesHistory = useStore($timeSeriesHistory)

    return {
        exchangeCurrency: exchangeCurrencyFx,
        fromCurrency,
        toCurrency,
        exchangeRate,
        amount,
        timeSeriesHistory
    }
}