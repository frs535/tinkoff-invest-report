import {useGetCurrenciesQuery} from "../../state/api";
import {Avatar, Box, Checkbox, IconButton, Typography} from "@mui/material";
import * as React from "react";
import {ToNumber} from "../../helpers/Helper";
import RefreshIcon from "@mui/icons-material/Refresh";
import {DataGrid} from "@mui/x-data-grid";

export const Currencies = ({currencies}) => {

    const { data: dataInfo=[], error, isLoading, refetch, isError } = useGetCurrenciesQuery({currencies})

    if (isLoading)
        return (<div>Загрузка</div>);

    if (isError)
        return (
            <Box>
                <div>{error.message}</div>
            </Box>
        );

    const data = currencies.map((currency) => {

        const info = dataInfo.find((p)=>p.figi === currency.figi);

        return{
            currency,
            info,
            figi: currency.figi,
            image: `https://invest-brands.cdn-tinkoff.ru/${info.brand.logoName.replace('.png', 'x160.png')}`,
            name: info.name,
            quantity: currency.quantity,
            price: currency.averagePositionPrice,
            amount: currency.averagePositionPrice * currency.quantity,
            currentPrice: currency.currentPrice,
            expectedYieldFifo: currency.expectedYield,
            Currency: info.currency,

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
            field: "name",
            headerName: "Наименование",
            headerAlign: "left",
            align: "left",
            flex: 0.4,
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
            field: "price",
            headerName: "Цена",
            description: 'Среденяя цена за акцию в портфеле',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
        },
        {
            field: "amount",
            headerName: "Сумма",
            headerAlign: "left",
            align: "left",
            flex: 0.2,
        },
        {
            field: "currentPrice",
            headerName: "Тек. цена",
            description: 'Текущая биржевая цена',
            headerAlign: "left",
            align: "left",
            flex: 0.2,
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
                width: 200,
                display: "flex",
            }} >
                <Typography sx={{ml:2, mt:1}} variant="h4" >Валюта</Typography>
                <IconButton onClick={()=>{ refetch()}}>
                    <RefreshIcon/>
                </IconButton>
            </Box>
            <DataGrid
                loading={isLoading}
                sx={{ flexGrow: 1, minWidth:50, overflowY: 'auto' }}
                columns={columns}
                rows={data}
                getRowId={(row) => row.figi}
                rowHeight={35}
            />
        </Box>
    )
}