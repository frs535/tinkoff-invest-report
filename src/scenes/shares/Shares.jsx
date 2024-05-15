import {useGetDividendsQuery, useGetPortfolioQuery, useGetSharesQuery} from "../../state/api";
import {
    Avatar,
    Box,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import * as React from "react";
import {ToFloat, ToLocalDate, ToMoneyFormat, ToNumber, ToPercent} from "../../helpers/Helper";
import {DataGrid} from "@mui/x-data-grid";
import RefreshIcon from "@mui/icons-material/Refresh";

export const Shares = ({shares}) => {

    const { data=[], error, isLoading, isFetching, refetch, isError } = useGetSharesQuery({shares})
    const {data: dvivdents, isLoading: isLoadingDividents} = useGetDividendsQuery({positions:shares}, {
            skip: isLoading,
        });

    if (isLoading || isLoadingDividents)
        return (<div>Загрузка</div>);

    if (isError)
        return (
            <Box>
                <div>{error.message}</div>
            </Box>
        );

    if (data.length===0)
        return "";

    const resultShare = data.map((row)=>{

        const shareDividends = dvivdents.filter((divident) => divident.figi === row.figi)

        const dividend = shareDividends.map((divs)=> {
            return ToNumber(divs.dividendNet)})

        const amountDividend = shareDividends.map((divs)=> {
            return ToNumber(divs.dividendNet * row.quantity, row.info.currency)})

        const closure = shareDividends.map((divs)=> {
            return ToLocalDate(new Date(divs.lastBuyDate))})

        const payment = shareDividends.map((divs)=> {
            return ToLocalDate(new Date(divs.paymentDate))})

        let profitability = shareDividends.reduce(
            (acc, curr) => acc + curr.dividendNet,
            0)

        if(profitability> 0 && row.averagePositionPrice > 0){
            profitability = profitability / row.averagePositionPrice
        }

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
            profitability: profitability >0 ? ToPercent(profitability): "",
            blocked: row.share.blocked,
            currency: row.currency,
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
                    <Avatar sx={{ width: 30, height: 30 }} src={p.row.image}/>
                )
            },
        },
        {
            field: "isin",
            headerName: "ISIN",
            headerAlign: "left",
            align: "left",
            flex: 0.25,
        },
        {
            field: "name",
            headerName: "Наименование",
            headerAlign: "left",
            align: "left",
            flex: 0.4,
        },
        {
            field: "currency",
            headerName: "Валюта",
            headerAlign: "left",
            align: "left",
            flex: 0.1,
        },
        {
            field: "quantity",
            headerName: "Кол.",
            description: 'Количество в портфеле',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
        },
        {
            field: "averagePositionPrice",
            headerName: "Цена",
            description: 'Среденяя цена за акцию в портфеле',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: p => { return ToNumber(p.row.averagePositionPrice) },
        },
        {
            field: "amount",
            headerName: "Сумма",
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: p => { return ToNumber(p.row.amount) },
        },
        {
            field: "currentPrice",
            headerName: "Тек. цена",
            description: 'Текущая биржевая цена',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: p => { return ToNumber(p.row.currentPrice) },
        },
        {
            field: "expectedYieldFifo",
            headerName: "Изменение",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToNumber(p.row.expectedYieldFifo) },
        },
        {
            field: "dividend",
            headerName: "Дивиденд",
            description: 'Дивиденд на одну акцию',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: (p) => {
                return <Box>{
                    p.row.dividend.map((arr)=> {
                     return <div>{arr}</div>}
                )}</Box>
            }
        },
        {
            field: "amountDividend",
            headerName: "Девидент, Σ",
            description: 'Сумма дивидентов на все количество. Без учета налога',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: (p) => {
                return <Box>{
                    p.row.amountDividend.map((arr)=> {
                        return <div>{arr}</div>}
                    )}</Box>
            }
        },
        {
            field: "profitability",
            headerName: "Доходность",
            description: 'Доходность, в процентах, на среднюю цену покупки',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
        },
        {
            field: "closure",
            headerName: "Закрытие",
            description: 'Дата, до которой включительно, необходимо купить акцию что бы получить дивиденд',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
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
            description: 'Плановая выплата дивиденда',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
            renderCell: (p) => {
                return <Box>{
                    p.row.payment.map((arr)=> {
                        return <div>{arr}</div>}
                    )}</Box>
            }
        },
        {
            field: "blocked",
            headerName: "Блок",
            description: 'Указывает заблокирована данная позиция для покупки продажи на бирже',
            headerAlign: "left",
            align: "left",
            flex: 0.1,
            renderCell: (p) => {
                return <Checkbox disabled checked={p.row.blocked}/>
            }
        },
    ]

    return (
        <Box>
            <Box sx={{
                mx: 'auto',
                width: 400,
                display: "flex",
            }} >
                <Typography sx={{ml:2, mt:1}} variant="h4" >Акции</Typography>
                <IconButton onClick={()=>{ refetch()}}>
                    <RefreshIcon/>
                </IconButton>
            </Box>
            <DataGrid
                loading={isLoading}
                sx={{ flexGrow: 1, minWidth:50, overflowY: 'auto' }}
                columns={columns}
                rows={resultShare}
                getRowId={(row) => row.figi}
                rowHeight={35}
            />
        </Box>
    )
}