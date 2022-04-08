import {
  Currency,
  ExchangeQuery,
  ExchangeRateHistoryItem,
} from "../../model/currency.model";
import { getConvertCurrency } from "../../api/exchange/convert/convert.api";
import { createDomain } from "effector";
import { useStore } from "effector-react";
import { getTimeSeriesData } from "../../api/exchange/timeseries/timeseries.api";
import { nanoid } from "nanoid";
import { persist } from "effector-storage/local";

type TransferCurrencyService = {
  exchangeCurrency(
    params: Omit<ExchangeQuery, "date" | "id"> & { saveQuery?: boolean }
  ): Promise<unknown>;
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  exchangeRate: number | null;
  amount: number | null;
  timeSeriesHistory: ExchangeRateHistoryItem[];
  queriesHistory: ExchangeQuery[];
  deleteHistoryQuery(params: { id: string }): void;
};

const exchangeCurrencyDomain = createDomain("exchangeCurrency");

const $fromCurrency = exchangeCurrencyDomain.createStore<null | Currency>(null);
const $toCurrency = exchangeCurrencyDomain.createStore<null | Currency>(null);
const $exchangeRate = exchangeCurrencyDomain.createStore<null | number>(null);
const $fromAmount = exchangeCurrencyDomain.createStore<null | number>(null);
const $timeSeriesHistory = exchangeCurrencyDomain.createStore<
  ExchangeRateHistoryItem[]
>([]);
const $queriesHistory = exchangeCurrencyDomain.createStore<ExchangeQuery[]>([]);

persist({ store: $queriesHistory, key: "queriesHistory" });

const exchangeCurrencyFx = exchangeCurrencyDomain.createEffect(
  async function exchangeCurrency(
    params: Parameters<TransferCurrencyService["exchangeCurrency"]>[0]
  ) {
    const [currencyResult, timeSeries] = await Promise.all([
      getConvertCurrency({
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
      }),
      getTimeSeriesData({
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
      }),
    ]);

    return {
      ...currencyResult,
      timeSeries,
    };
  }
);

const deleteHistoryQueryFx = exchangeCurrencyDomain.createEvent<{
  id: string;
}>();

$queriesHistory.on(deleteHistoryQueryFx, (state, data) => {
  return state.filter((q) => {
    return q.id !== data.id;
  });
});

$queriesHistory.on(exchangeCurrencyFx.done, (state, data) => {
  const saveQuery =
    data.params.saveQuery === undefined ? true : data.params.saveQuery;
  if (!saveQuery) {
    return state;
  }
  return [
    ...state,
    {
      id: nanoid(),
      fromCurrency: data.params.fromCurrency,
      toCurrency: data.params.toCurrency,
      amount: data.params.amount,
      date: new Date(),
    },
  ];
});

$timeSeriesHistory.on(exchangeCurrencyFx.done, (state, data) => {
  return data.result.timeSeries;
});

$fromCurrency.on(exchangeCurrencyFx.done, (state, data) => {
  return data.result.from;
});

$toCurrency.on(exchangeCurrencyFx.done, (state, data) => {
  return data.result.to;
});

$exchangeRate.on(exchangeCurrencyFx.done, (state, data) => {
  return data.result.rate;
});

$fromAmount.on(exchangeCurrencyFx.done, (state, data) => {
  return data.params.amount;
});

export function useTransferCurrency(): TransferCurrencyService {
  const fromCurrency = useStore($fromCurrency);
  const toCurrency = useStore($toCurrency);
  const exchangeRate = useStore($exchangeRate);
  const amount = useStore($fromAmount);
  const timeSeriesHistory = useStore($timeSeriesHistory);
  const queriesHistory = useStore($queriesHistory);

  return {
    exchangeCurrency: exchangeCurrencyFx,
    fromCurrency,
    toCurrency,
    exchangeRate,
    amount,
    timeSeriesHistory,
    queriesHistory,
    deleteHistoryQuery: deleteHistoryQueryFx,
  };
}
