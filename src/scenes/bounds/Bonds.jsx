import {useGetPortfolioQuery, useGetBondQuery, useGetBondsQuery, useGetBonds2Query} from "../../state/api";
import {Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";

function ToFloat(item, currency){

    if (!item && currency)
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUR' }).format(0,)

    if (!item && !currency) return 0;

    const units = parseFloat(item.units?.replace(",", "."));
    const nano = item.nano? Math.round(item.nano/10000000) / 100 : 0;

    const result = units + nano;

    if (currency)
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUR' }).format(result,);

    return result;
}

export const Bonds = ({accountId, currency}) => {

    const [numberOfMonths, setNumberOfMonths] = useState(12);

    const { data: bonds=[], error, isLoading, isFetching, isError } = useGetBondsQuery({accountId, currency})

    if (isLoading || isFetching)
        return (<div>Загрузка</div>)

    if (isError)
        return (
            <Box>
                <div>{error?.data?.status}</div>
                <div>{error?.data?.error}</div>
                <div>{error}</div>
            </Box>
        )

    var counter = 0;
    return (
        <Box>
            <Box sx={{ mx: 'auto', width: 200 }} >
                <Typography sx={{ml:2, mt:2}} variant="h4">Облигации</Typography>
            </Box>
            <Box sx={{ lm: '20px' }}>
                <TextField label="Месяцы для расчета"
                           type="number"
                           inputProps={{ type: 'number', shrink: true}}
                           size="small"
                           value={numberOfMonths}
                           onChange={(e)=> setNumberOfMonths(parseInt(e.target.value))}/>
            </Box>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Наименование</TableCell>
                        <TableCell>ISIN</TableCell>
                        <TableCell>Количество</TableCell>
                        <TableCell>Цена </TableCell>
                        <TableCell>Текущая цена</TableCell>
                        <TableCell>Изменение</TableCell>
                        <TableCell>НКД</TableCell>
                        <TableCell align="right">Заблокирована</TableCell>
                        {
                            numberOfMonths > 0 ? new Array(numberOfMonths)
                                    .fill(counter++,)
                                    .map((number, index)=>{
                                        const currentDate = new Date()
                                        const date = new Date(currentDate)
                                        date.setMonth(date.getMonth() + 1 + index)
                                        return <TableCell>{`${date.getMonth()==0 ? 12:date.getMonth()}/${date.getFullYear()}`}</TableCell>
                                    })
                            : ""
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        bonds.map(row=>(
                            <TableRow key={row.figi}>
                                <TableCell>{row.info.name}</TableCell>
                                <TableCell>{row.info.isin}</TableCell>
                                <TableCell>{ToFloat(row.bond.quantity) }</TableCell>
                                <TableCell>{ToFloat(row.bond.averagePositionPrice, true)}</TableCell>
                                <TableCell>{ToFloat(row.bond.currentPrice, true)}</TableCell>
                                <TableCell>{ToFloat(row.bond.expectedYieldFifo, true)}</TableCell>
                                <TableCell>{ToFloat(row.bond.currentNkd, true)}</TableCell>
                                <TableCell>{<Checkbox disabled checked={row.bond.blocked} />}</TableCell>
                                {
                                    numberOfMonths > 0 ? new Array(numberOfMonths)
                                            .fill(0)
                                            .map((number, index)=>{
                                                const currentDate = new Date()
                                                const date = new Date(currentDate)
                                                date.setMonth(date.getMonth() + 1 + index)
                                                return <TableCell>{1 + index}</TableCell>
                                            })
                                        : ""
                                }
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </Box>
    )
}