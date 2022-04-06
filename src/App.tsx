import React from 'react';
import './App.css';
import {CurrencyExchangeForm} from "./widgets/CurrencyTransferForm/CurrencyExchangeForm";
import {AppBar, Container, Divider, Grid, Tab, Tabs, Typography} from "@mui/material";
import {CurrencyExchangeView} from "./widgets/CurrencyExchangeView/CurrencyExchangeView";
import {CurrencyExchangeHistory} from "./widgets/CurrencyExchangeHistory/CurrencyExchangeHistory";




function App() {

  return (
      <div style={{ marginBottom: '128px'}}>
      <AppBar position={'static'}>
        <Container maxWidth={"lg"}>
          <Typography>
            Logo
          </Typography>
          <Tabs value={0} onChange={() => {}} aria-label="basic tabs example">
            <Tab label="Item One" value={0}  />
            <Tab label="Item Two"  />
            <Tab label="Item Three" />
          </Tabs>
        </Container>
      </AppBar>
      <Container maxWidth={"lg"}>
        <Grid container spacing={2}>
          <Grid xs={12} item>
            <Typography variant={'h1'} marginTop={8}>
              I want to convert
            </Typography>
          </Grid>
          <Grid container spacing={2} marginTop={8}>
            <CurrencyExchangeForm />
          </Grid>
          <Grid item xs={12}>
            <CurrencyExchangeView />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <CurrencyExchangeHistory />
        </Grid>
      </Container>
      </div>

  );
}

export default App;
