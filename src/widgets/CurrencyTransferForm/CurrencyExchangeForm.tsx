import {Button, Grid, MenuItem, TextField} from "@mui/material";
import React from "react";
import {useTransferCurrency} from "../../services/transferCurrency/transferCurrency";
import {Currency} from "../../model/currency.model";

const currencies = [
    {
        value: 'USD',
        label: 'USD',
    },
    {
        value: 'EUR',
        label: 'EUR',
    },
    {
        value: 'BTC',
        label: 'BTC',
    },
    {
        value: 'JPY',
        label: 'JPY',
    },
];

export function CurrencyExchangeForm() {
    const transferCurrencyService = useTransferCurrency();

    const [currencyFrom, setCurrencyFrom] = React.useState(currencies[0].value);
    const [currencyTo, setCurrencyTo] = React.useState(currencies[1].value);
    const [amount, setAmount] = React.useState(1);

    const handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyFrom(event.target.value);
    };

    const handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyTo(event.target.value);
    };

    const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value))
    }

    const handleSubmit = () => {
        transferCurrencyService.exchangeCurrency({
            fromCurrency: Currency.EUR,
            toCurrency: Currency.USD,
            amount: amount
        })
    }


    return (
        <Grid container spacing={2}>
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
        </Grid>
    )
}