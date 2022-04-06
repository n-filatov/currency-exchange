import {Button, Grid, MenuItem, TextField} from "@mui/material";
import React from "react";
import {useTransferCurrency} from "../../services/transferCurrency/transferCurrency";
import {Currency} from "../../model/currency.model";

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

export function CurrencyExchangeForm() {
    const transferCurrencyService = useTransferCurrency();

    const [currencyFrom, setCurrencyFrom] = React.useState<Currency>(currencies[0].value);
    const [currencyTo, setCurrencyTo] = React.useState<Currency>(currencies[1].value);
    const [amount, setAmount] = React.useState(1);

    const handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyFrom(mapValue(event.target.value));
    };

    const handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyTo(mapValue(event.target.value));
    };

    const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value))
    }

    const handleSubmit = () => {
        transferCurrencyService.exchangeCurrency({
            fromCurrency: currencyFrom,
            toCurrency: currencyTo,
            amount: amount
        })
    }


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
                <Button variant={'contained'} onClick={handleSubmit}>
                    Convert
                </Button>
            </Grid>
        </>


    )
}