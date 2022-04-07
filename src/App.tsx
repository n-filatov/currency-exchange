import React, {useState} from 'react';
import './App.css';
import {CurrencyExchangeForm} from "./widgets/CurrencyTransferForm/CurrencyExchangeForm";
import {AppBar, Container, Divider, Grid, Tab, Tabs, Typography} from "@mui/material";
import {CurrencyExchangeView} from "./widgets/CurrencyExchangeView/CurrencyExchangeView";
import {CurrencyExchangeHistory} from "./widgets/CurrencyExchangeHistory/CurrencyExchangeHistory";
import {QueryHistoryTable} from "./widgets/QueryHistoryTable/QueryHistoryTable";


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
        <Grid item xs={12}>
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
          <Typography variant={'h1'} marginTop={8}>
            Conversion history
          </Typography>
          <QueryHistoryTable />
        </Grid>
      </Grid>
  )
}


function App() {

  const [selectedTab, setSelectedTab] = useState(0)

  return (
      <div style={{ marginBottom: '128px'}}>
      <AppBar position={'static'}>
        <Container maxWidth={"lg"}>
          <Typography>
            Logo
          </Typography>
          <Tabs value={selectedTab} onChange={(e, newValue) => {
            setSelectedTab(newValue)
          }} aria-label="basic tabs example">
            <Tab label="Item One" value={0}  />
            <Tab label="Item Two" value={1}  />
          </Tabs>
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
