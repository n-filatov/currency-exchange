import {addDays, format, parseISO, subDays} from "date-fns";
import {Currency, ExchangeRateHistoryItem} from "../../../model/currency.model";
import {baseExchangeUrl} from "../exchange.api";

type RawTimeSeriesResult = {
    rates: {
        [date: string]: {
            [currencyName: string]: number
        }
    }
}

const formatDate = (date: Date) => {
    return format(date, 'yyyy-MM-dd');
}

function mapRawExchangeHistoryResult(rawResult: RawTimeSeriesResult, toCurrency: string): ExchangeRateHistoryItem[] {
    const { rates } = rawResult;
    const result: ExchangeRateHistoryItem[] = []

    for(let [dateString, currencyRates] of Object.entries(rates)) {
        const isIncludesRate = currencyRates[toCurrency] !== undefined;
        if(isIncludesRate) {
            result.push({
                date: parseISO(dateString),
                rate: currencyRates[toCurrency]
            })
        }
    }

    return result
}

export async function getTimeSeriesData(params: { fromCurrency: Currency, toCurrency: Currency }) {
        const to = new Date();
        const from = subDays(to, 30);

        const response = await fetch(`${baseExchangeUrl}/timeseries?start_date=${formatDate(from)}&end_date=${formatDate(to)}&base=${params.fromCurrency}`)

        const result = await response.json();
        return mapRawExchangeHistoryResult(result, params.toCurrency);
}