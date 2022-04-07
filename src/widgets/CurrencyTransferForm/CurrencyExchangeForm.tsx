import {Button, Grid, MenuItem, TextField} from "@mui/material";
import React from "react";
import {useTransferCurrency} from "../../services/transferCurrency/transferCurrency";
import {Currency} from "../../model/currency.model";
import { createEvent, createStore} from "effector";
import {useStore} from "effector-react";

const currencies = [
    {
        value: Currency.USD,
        label: 'USD',
    },
    {
        value: Currency.EUR,
        label: 'EUR',
    },
    {
        value: Currency.BTC,
        label: 'BTC',
    },
    {
        value: Currency.JPY,
        label: 'JPY',
    },
];

const mapValue = (value: string) => {
    switch (value) {
        case 'USD':
            return Currency.USD;
        case 'EUR':
            return Currency.EUR;
        case 'JPY':
            return Currency.JPY;
        case 'BTC':
            return Currency.BTC
        default:
            return Currency.Unknown;
    }
}
//
const $currencyFrom = createStore<Currency>(currencies[0].value);
const $currencyTo = createStore<Currency>(currencies[1].value);
const $amount = createStore<number>(1);

const setCurrencyFromFx = createEvent<Currency>();
const setCurrencyToFx = createEvent<Currency>();
const setAmountFx = createEvent<number>();

$currencyFrom.on(setCurrencyFromFx, (state, data) => {
    return data;
})

$currencyTo.on(setCurrencyToFx, (state, data) => {
    return data;
})

$amount.on(setAmountFx, (state, data) => {
    return data;
})

export const useViewModel = () => {
    const transferCurrencyService = useTransferCurrency();

    const currencyFrom = useStore($currencyFrom);
    const currencyTo = useStore($currencyTo);
    const amount = useStore($amount);

    const handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyFromFx(mapValue(event.target.value));
    };

    const handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyToFx(mapValue(event.target.value));
    };

    const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmountFx(Number(event.target.value))
    }

    const handleSubmit = (params: {
        currencyFrom: Currency,
        currencyTo: Currency,
        amount: number,
        saveQuery?: boolean
    }) => {
        transferCurrencyService.exchangeCurrency({
            fromCurrency: params.currencyFrom,
            toCurrency: params.currencyTo,
            amount: params.amount,
            saveQuery: params.saveQuery
        }).then(() => {
            setCurrencyFromFx(params.currencyFrom);
            setCurrencyToFx(params.currencyTo);
            setAmountFx(params.amount)
        })
    }

    return {
        handleChangeFrom,
        handleChangeTo,
        handleChangeAmount,
        handleSubmit,
        currencyFrom,
        currencyTo,
        amount,
    }
}

export function CurrencyExchangeForm() {
    const {
        handleChangeAmount,
        handleChangeFrom,
        handleChangeTo,
        handleSubmit,
        currencyTo,
        currencyFrom,
        amount
    } = useViewModel();

    return (
        <>
            <Grid item xs={3}>
                <TextField id="standard-basic" label="Amount" variant="standard" value={amount} onChange={handleChangeAmount} />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="standard-select-currency"
                    select
                    label="Select"
                    value={currencyFrom}
                    onChange={handleChangeFrom}
                    helperText="Please select your currency"
                    variant="standard"
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    id="standard-select-currency"
                    select
                    label="Select"
                    value={currencyTo}
                    onChange={handleChangeTo}
                    helperText="Please select your currency"
                    variant="standard"
                >
                    {currencies.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={3}>
                <Button variant={'contained'} onClick={() => {
                    handleSubmit({
                        currencyFrom,
                        currencyTo,
                        amount
                    })
                }}>
                    Convert
                </Button>
            </Grid>
        </>


    )
}