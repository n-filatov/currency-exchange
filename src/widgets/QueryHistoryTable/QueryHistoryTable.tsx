import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {Currency, ExchangeQuery} from "../../model/currency.model";
import {nanoid} from "nanoid";
import { DeleteForever, RemoveRedEye} from "@mui/icons-material";
import {useTransferCurrency} from "../../services/transferCurrency/transferCurrency";

const useViewModel = () => {
    const service = useTransferCurrency()

    return {
        queriesHistory: service.queriesHistory,
        deleteHistoryQuery: service.deleteHistoryQuery
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
                                    {row.date.toISOString()}
                                </TableCell>
                                <TableCell>{`Converted an amount of ${row.amount} from ${row.fromCurrency} to ${row.toCurrency}`}</TableCell>
                                <TableCell>
                                    <Button startIcon={<RemoveRedEye />}>
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