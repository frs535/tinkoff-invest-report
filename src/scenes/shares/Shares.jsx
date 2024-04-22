import {useGetPortfolioQuery} from "../../state/api";
import {Box, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import * as React from "react";

function ToFloat(item, currency){
    const units = parseFloat(item.units.replace(",", "."));
    const nano = item.nano? Math.round(item.nano/10000000) / 100 : 0;

    const result = units + nano;

    if (currency)
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUR' }).format(result,);

    return result;
}
export const Shares = ({accountId, currency}) => {

    const { data=[], error, isLoading, isFetching, isError } = useGetPortfolioQuery({accountId, currency});

    if (isLoading)
        return (<div>Загрузка</div>);

    if (isError)
        return (
            <Box>
                <div>{error.data.status}</div>
                <div>{error.data.error}</div>
            </Box>
        );

    if (data.positions.filter(row=>row.instrumentType === 'share').length === 0)
        return "";

    return (
        <Box>
            <Box sx={{ mx: 'auto', width: 200 }} >
                <Typography sx={{ml:2, mt:2}} variant="h4">Акции</Typography>
            </Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ISIN</TableCell>
                        <TableCell>Количество</TableCell>
                        <TableCell>Цена </TableCell>
                        <TableCell>Текущая цена</TableCell>
                        <TableCell>Изменение</TableCell>
                        <TableCell align="right">Заблокирована</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.positions.filter(row=>row.instrumentType === 'share').map(row=>(
                            <TableRow key={row.figi}>
                                <TableCell>{row.figi}</TableCell>
                                <TableCell>{ToFloat(row.quantity) }</TableCell>
                                <TableCell>{ToFloat(row.averagePositionPrice, true)}</TableCell>
                                <TableCell>{ToFloat(row.currentPrice, true)}</TableCell>
                                <TableCell>{ToFloat(row.expectedYieldFifo, true)}</TableCell>
                                <TableCell>{row.blocked.toString()}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </Box>
    )
}