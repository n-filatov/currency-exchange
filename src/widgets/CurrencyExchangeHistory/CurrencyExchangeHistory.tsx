import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem, Paper,
    Radio,
    RadioGroup, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    TextField,
    Typography
} from "@mui/material";
import React, {useMemo, useState} from "react";
import {useTransferCurrency} from "../../services/transferCurrency/transferCurrency";
import {format, isBefore} from "date-fns";

const variants = [
    {
        value: 7,
        label: '7 days',
    },
    {
        value: 14,
        label: '14 days',
    },
    {
        value: 30,
        label: '30 days',
    }
];

const useViewModel = () => {
    const service = useTransferCurrency();

    const [selectedFilterVariant, setSelectedFilterVariant] = useState(variants[0].value);

    const historyRaws = useMemo(() => {
        return service.timeSeriesHistory.sort((a, b) => {
            return isBefore(a.date, b.date) ? 1 : -1
        }).map(i => {
            return {
                date: format(i.date, 'dd/MM/yyyy'),
                rate: i.rate
            }
        }).slice(0, selectedFilterVariant)
    }, [selectedFilterVariant, service.timeSeriesHistory])

    const statistics = useMemo(() => {
        let lowest = Infinity;
        let highest = -Infinity;
        let sum = 0;
        service.timeSeriesHistory.forEach((item) => {
            if(item.rate > highest) {
                highest = item.rate
            }

            if(item.rate < lowest) {
                lowest = item.rate
            }

            sum += item.rate
        }, []);

        return [{
            title: 'Lowest',
            rate: lowest
        },
            {
                title: 'Highest',
                rate: highest
            },
            {
                title: 'Average',
                rate: sum / service.timeSeriesHistory.length
            }
        ]
    }, [service.timeSeriesHistory])

    return {
        historyRaws,
        statistics,
        selectedFilterVariant,
        setSelectedFilterVariant
    }
}

export function CurrencyExchangeHistory() {
    const viewModel = useViewModel();
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant={"h3"}>
                    Exchange History
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <TextField
                    id="standard-select-currency"
                    select
                    label="Select"
                    value={viewModel.selectedFilterVariant}
                    onChange={(e) => viewModel.setSelectedFilterVariant(Number(e.target.value))}
                    helperText="Please select your currency"
                    variant="standard"
                >
                    {variants.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Grid>
            <Grid item xs={10}>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                    >
                        <FormControlLabel value="table" control={<Radio />} label="Table" />
                        <FormControlLabel value="chart" control={<Radio />} label="Chart" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Exchange Rate</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {viewModel.historyRaws.map((row) => (
                                <TableRow
                                    key={row.date}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.date}
                                    </TableCell>
                                    <TableCell>{row.rate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid item xs={6}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Statistics</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {viewModel.statistics.map((row) => (
                                <TableRow
                                    key={row.title}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.title}
                                    </TableCell>
                                    <TableCell>{row.rate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}