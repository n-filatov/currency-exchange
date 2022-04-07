import {Box, Container, Stack, Typography} from "@mui/material";
import React from "react";
import {useTransferCurrency} from "../../services/transferCurrency/transferCurrency";

const useViewModel = () => {
    const service = useTransferCurrency();

    const show = React.useMemo(() => {
        return service.amount !== null && service.exchangeRate !== null && service.fromCurrency !== null && service.toCurrency !== null;
    }, [service.amount, service.exchangeRate, service.fromCurrency, service.toCurrency])

    const toAmount = React.useMemo(() => {
        if(service.amount === null || service.exchangeRate === null) {
            return 0
        }

        return service.amount * service.exchangeRate;
    }, [service.amount, service.exchangeRate]);

    const toExchangeRate = React.useMemo(() => {
        if(service.exchangeRate === null) {
            return 0;
        }

        return 1 / service.exchangeRate;
    }, [service.exchangeRate]);

    return {
        show,
        fromAmount: service.amount,
        toAmount,
        fromCurrency: service.fromCurrency,
        toCurrency: service.toCurrency,
        fromExchangeRate: service.exchangeRate,
        toExchangeRate
    }
}

export function CurrencyExchangeView() {
    const viewModel = useViewModel();

    if(!viewModel.show) {
        return null;
    }

    return (
        <Box sx={{ flexDirection: 'column', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant={'h3'}>
                    {`${viewModel.fromAmount} ${viewModel.fromCurrency} = ${viewModel.toAmount} ${viewModel.toCurrency}`}
                </Typography>
                <Typography variant={'body1'} marginTop={4}>
                    {`1 ${viewModel.fromCurrency} = ${viewModel.fromExchangeRate} ${viewModel.toCurrency}`}
                </Typography>
                <Typography variant={'body1'}>
                    {`1 ${viewModel.toCurrency} = ${viewModel.toExchangeRate} ${viewModel.fromCurrency}`}
                </Typography>
        </Box>

    )
}