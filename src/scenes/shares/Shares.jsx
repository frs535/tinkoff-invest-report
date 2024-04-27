import {useGetDividendsQuery, useGetPortfolioQuery, useGetSharesQuery} from "../../state/api";
import {Avatar, Box, Checkbox, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import * as React from "react";
import {ToFloat, ToLocalDate, ToMoneyFormat} from "../../helpers/Helper";
import {DataGrid} from "@mui/x-data-grid";

export const Shares = ({shares}) => {

    const { data=[], error, isLoading, isFetching, isError } = useGetSharesQuery({shares});
    const {data: dvivdents, isLoading: isLoadingDividents} = useGetDividendsQuery({positions:shares}, {
            skip: isLoading,
        });

    if (isLoading || isLoadingDividents)
        return (<div>Загрузка</div>);

    if (isError)
        return (
            <Box>
                <div>{error.data.status}</div>
                <div>{error.data.error}</div>
            </Box>
        );

    if (data.length===0)
        return "";

    const resultShare = data.map((row)=>{

        const shareDividends = dvivdents.filter((divident) => divident.figi === row.figi)

        const dividend = shareDividends.map((divs)=> {
            return ToMoneyFormat(divs.dividendNet, row.info.currency)})

        const amountDividend = shareDividends.map((divs)=> {
            return ToMoneyFormat(divs.dividendNet * row.quantity, row.info.currency)})

        const closure = shareDividends.map((divs)=> {
            return ToLocalDate(new Date(divs.lastBuyDate))})

        const payment = shareDividends.map((divs)=> {
            return ToLocalDate(new Date(divs.paymentDate))})

        return{
            figi: row.figi,
            image: row.image,
            name: row.name,
            isin: row.isin,
            quantity: row.quantity,
            averagePositionPrice: row.averagePositionPriceFifo,
            amount: row.amount,
            expectedYield: row.expectedYield,
            currentNkd: row.currentNkd,
            averagePositionPricePt: row.averagePositionPricePt,
            currentPrice: row.currentPrice,
            averagePositionPriceFifo: row.averagePositionPriceFifo,
            quantityLots: row.quantityLots,
            blockedLots: row.blockedLots,
            varMargin: row.varMargin,
            expectedYieldFifo: row.expectedYieldFifo,
            dividend,
            amountDividend,
            closure,
            payment,
            blocked: row.share.blocked,
            currency: row.info.currency,
        }
    })

    const columns = [
        {
            field: "image",
            headerName: "",
            sortable: false,
            cellClassName: 'actions',
            flex: 0.2,
            renderCell: (p) => {
                return (
                    <Avatar src={p.row.image}/>
                )
            },
        },
        {
            field: "isin",
            headerName: "ISIN",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
        },
        {
            field: "name",
            headerName: "Наименование",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
        },
        {
            field: "quantity",
            headerName: "Количество",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
        },
        {
            field: "averagePositionPrice",
            headerName: "Цена",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToMoneyFormat(p.row.averagePositionPrice, p.row.currency) },
        },
        {
            field: "amount",
            headerName: "Сумма",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToMoneyFormat(p.row.amount, p.row.currency) },
        },
        {
            field: "currentPrice",
            headerName: "Текущая цена",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToMoneyFormat(p.row.currentPrice, p.row.currency) },
        },
        {
            field: "expectedYieldFifo",
            headerName: "Изменение",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToMoneyFormat(p.row.expectedYieldFifo, p.row.currency) },
        },
        {
            field: "dividend",
            headerName: "Девидент",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: (p) => {
                return <Box>{
                    p.row.dividend.map((arr)=> {
                     return <div>{arr}</div>}
                )}</Box>
            }
        },
        {
            field: "amountDividend",
            headerName: "Девидент (сумма)",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: (p) => {
                return <Box>{
                    p.row.amountDividend.map((arr)=> {
                        return <div>{arr}</div>}
                    )}</Box>
            }
        },
        {
            field: "closure",
            headerName: "Закрытие",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: (p) => {
                return <Box>{
                    p.row.closure.map((arr)=> {
                        return <div>{arr}</div>}
                    )}</Box>
            }
        },
        {
            field: "payment",
            headerName: "Выплата",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: (p) => {
                return <Box>{
                    p.row.payment.map((arr)=> {
                        return <div>{arr}</div>}
                    )}</Box>
            }
        },
        {
            field: "blocked",
            headerName: "Заблокирована",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: (p) => {
                return <Checkbox disabled checked={p.row.blocked}/>
            }
        },
    ]

    return (
        <Box>
            <Box sx={{ mx: 'auto', width: 200 }} >
                <Typography sx={{ml:2, mt:2}} variant="h4">Акции</Typography>
            </Box>
            <DataGrid
                loading={isLoading}
                sx={{ flexGrow: 1, minWidth:50, overflowY: 'auto' }}
                columns={columns}
                rows={resultShare}
                getRowId={(row) => row.figi}
            />
            {/*<Table size="small">*/}
            {/*    <TableHead>*/}
            {/*        <TableRow>*/}
            {/*            <TableCell></TableCell>*/}
            {/*            <TableCell>ISIN</TableCell>*/}
            {/*            <TableCell>Наименование</TableCell>*/}
            {/*            <TableCell>Количество</TableCell>*/}
            {/*            <TableCell>Цена</TableCell>*/}
            {/*            <TableCell>Сумма</TableCell>*/}
            {/*            <TableCell>Текущая цена</TableCell>*/}
            {/*            <TableCell>Изменение</TableCell>*/}
            {/*            <TableCell>Дивидент</TableCell>*/}
            {/*            <TableCell>Дивидент (сумма)</TableCell>*/}
            {/*            <TableCell>Закрытие</TableCell>*/}
            {/*            <TableCell>Выплата</TableCell>*/}
            {/*            <TableCell align="right">Заблокировано</TableCell>*/}
            {/*        </TableRow>*/}
            {/*    </TableHead>*/}
            {/*    <TableBody>*/}
            {/*        {data? data.map((row)=> {*/}

            {/*            const shareDividends = dvivdents.filter((divident) => divident.figi === row.figi)*/}
            {/*                return (*/}
            {/*                    <TableRow key={row.figi}>*/}
            {/*                        <TableCell>*/}
            {/*                            <Avatar*/}
            {/*                                src={`https://invest-brands.cdn-tinkoff.ru/${row.info.brand.logoName.replace('.png', 'x160.png')}`}/>*/}
            {/*                        </TableCell>*/}
            {/*                        <TableCell>{row.figi}</TableCell>*/}
            {/*                        <TableCell>{row.info.name}</TableCell>*/}
            {/*                        <TableCell>{row.quantity}</TableCell>*/}
            {/*                        <TableCell>{ToMoneyFormat(row.averagePositionPrice, row.info.currency)}</TableCell>*/}
            {/*                        <TableCell>{ToMoneyFormat(row.averagePositionPrice * row.quantity, row.info.currency)}</TableCell>*/}
            {/*                        <TableCell>{ToMoneyFormat(row.currentPrice, row.info.currency)}</TableCell>*/}
            {/*                        <TableCell>{ToMoneyFormat(row.expectedYieldFifo, row.info.currency)}</TableCell>*/}
            {/*                        <TableCell>{shareDividends.map((divs)=> {*/}
            {/*                                return <div>{ToMoneyFormat(divs.dividendNet, row.info.currency)}</div>})}*/}
            {/*                        </TableCell>*/}
            {/*                        <TableCell>{shareDividends.map((divs)=> {*/}
            {/*                            return <div>{ToMoneyFormat(divs.dividendNet * row.quantity, row.info.currency)}</div>})}*/}
            {/*                        </TableCell>*/}
            {/*                        <TableCell>{shareDividends.map((divs)=> {*/}
            {/*                            return <div>{ToLocalDate(new Date(divs.lastBuyDate))}</div>})}*/}
            {/*                        </TableCell>*/}
            {/*                        <TableCell>{shareDividends.map((divs)=> {*/}
            {/*                            return <div>{ToLocalDate(new Date(divs.paymentDate))}</div>})}*/}
            {/*                        </TableCell>*/}
            {/*                        <TableCell>{<Checkbox disabled checked={row.share.blocked}/>}</TableCell>*/}
            {/*                    </TableRow>*/}
            {/*                )*/}
            {/*            }) :""}*/}
            {/*    </TableBody>*/}
            {/*</Table>*/}
        </Box>
    )
}