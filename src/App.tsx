import React, {useState} from 'react';
import './App.css';
import {CurrencyExchangeForm} from "./widgets/CurrencyTransferForm/CurrencyExchangeForm";
import {AppBar, Box, Container, Divider, Grid, Tab, Tabs, Typography} from "@mui/material";
import {CurrencyExchangeView} from "./widgets/CurrencyExchangeView/CurrencyExchangeView";
import {CurrencyExchangeHistory} from "./widgets/CurrencyExchangeHistory/CurrencyExchangeHistory";
import {QueryHistoryTable} from "./widgets/QueryHistoryTable/QueryHistoryTable";
import {createEffect, createEvent, createStore} from "effector";
import {useStore} from "effector-react";


function MainTab() {

  return (
      <Grid container spacing={2}>
        <Grid xs={12} item>
          <Typography variant={'h1'} marginTop={8}>
            I want to convert
          </Typography>
        </Grid>
        <Grid container spacing={2} marginTop={8}>
          <CurrencyExchangeForm />
        </Grid>
        <Grid item xs={12} marginTop={8} marginBottom={8}>
          <CurrencyExchangeView />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <CurrencyExchangeHistory />
      </Grid>
  )
}

function HistoryTab() {
  return (
      <Grid container spacing={2}>
        <Grid xs={12} item>
          <Typography variant={'h1'} marginTop={8} marginBottom={4}>
            Conversion history
          </Typography>
          <QueryHistoryTable />
        </Grid>
      </Grid>
  )
}

const $selectedTab = createStore<number>(0);

const setSelectedTabFx = createEvent<number>();

$selectedTab.on(setSelectedTabFx, (state, data) => {
    return data;
})

export const useViewModel = () => {
    const selectedTab = useStore($selectedTab)

    return {
        selectedTab,
        setSelectedTab: setSelectedTabFx
    }
}


function App() {
    const { setSelectedTab, selectedTab } = useViewModel();

  return (
      <div style={{ marginBottom: '128px'}}>
      <AppBar position={'static'} color={'default'}>
        <Container maxWidth={"lg"}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Typography marginRight={4}>
                Currency Exchange
              </Typography>
              <Tabs value={selectedTab} onChange={(e, newValue) => {
                setSelectedTab(newValue)
              }} aria-label="basic tabs example">
                <Tab label="Currency Converter" value={0}  />
                <Tab label="View Conversion History" value={1}  />
              </Tabs>
            </Box>
        </Container>
      </AppBar>
      <Container maxWidth={"lg"}>
        {selectedTab === 0 && <MainTab />}
        {selectedTab === 1 && <HistoryTab />}
      </Container>
      </div>

  );
}

export default App;
