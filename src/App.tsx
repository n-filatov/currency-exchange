import React from 'react';
import './App.css';
import {CurrencyExchangeForm} from "./widgets/CurrencyTransferForm/CurrencyExchangeForm";
import {Container, Grid, Typography} from "@mui/material";
import {useTransferCurrency} from "./services/transferCurrency/transferCurrency";


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

  return {
    show,
    fromAmount: service.amount,
    toAmount,
    fromCurrency: service.fromCurrency,
    toCurrency: service.toCurrency
  }
}

function App() {
  const viewModel = useViewModel();
  return (
      <Container>
        <Grid container spacing={2}>
          <Grid xs={12} item>
            <Typography variant={'h1'}>
              I want to convert
            </Typography>
          </Grid>
          <CurrencyExchangeForm />
          <Grid item xs={12}>
          {viewModel.show && (
              <Typography variant={'h3'}>
                {`${viewModel.fromAmount} ${viewModel.fromCurrency} = ${viewModel.toAmount} ${viewModel.toCurrency}`}
              </Typography>
          )}
          </Grid>
        </Grid>
      </Container>
  );
}

export default App;
