import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React, {useCallback} from "react";
import {Currency} from "../../model/currency.model";
import { DeleteForever, RemoveRedEye} from "@mui/icons-material";
import {useTransferCurrency} from "../../services/transferCurrency/transferCurrency";
import { useViewModel as useCurrencyTransferFormViewModel } from '../CurrencyTransferForm/CurrencyExchangeForm'
import { useViewModel as useTabsViewModel } from "../../App";

const useViewModel = () => {
    const service = useTransferCurrency()
    const currencyTransferFormViewModel = useCurrencyTransferFormViewModel()
    const tabsViewModel = useTabsViewModel();

    const viewHistoryQuery = useCallback((params: { currencyFrom: Currency, currencyTo: Currency, amount: number }) => {
        currencyTransferFormViewModel.handleSubmit({
            ...params,
            saveQuery: false
        })
        tabsViewModel.setSelectedTab(0)
    }, [currencyTransferFormViewModel, tabsViewModel])

    return {
        queriesHistory: service.queriesHistory,
        deleteHistoryQuery: service.deleteHistoryQuery,
        viewHistoryQuery: viewHistoryQuery
    }
}

export function QueryHistoryTable() {
    const viewModel = useViewModel();

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Event</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {viewModel.queriesHistory.map((row) => {
                        return (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell>
                                    {typeof row.date === 'string' ? row.date : row.date.toISOString()}
                                </TableCell>
                                <TableCell>{`Converted an amount of ${row.amount} from ${row.fromCurrency} to ${row.toCurrency}`}</TableCell>
                                <TableCell>
                                    <Button startIcon={<RemoveRedEye />} onClick={() => {
                                        viewModel.viewHistoryQuery({
                                            currencyFrom: row.fromCurrency,
                                            currencyTo: row.toCurrency,
                                            amount: row.amount
                                        })
                                    }}>
                                        View
                                    </Button>
                                    <Button startIcon={<DeleteForever />} onClick={() => viewModel.deleteHistoryQuery({ id: row.id })}>
                                        Delete from history
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}