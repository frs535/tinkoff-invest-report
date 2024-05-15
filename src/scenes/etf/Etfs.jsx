import {Avatar, Box, Typography} from "@mui/material";
import * as React from "react";
import {useGetDividendsQuery, useGetEtfsQuery} from "../../state/api";
import {DataGrid} from "@mui/x-data-grid";
import {ToMoneyFormat} from "../../helpers/Helper";

export const Etfs = ({etfs})=>{

    const { data=[], error, isLoading, isFetching, isError } = useGetEtfsQuery({etfs});
    const {data: dvivdents, isLoading: isLoadingDividents} = useGetDividendsQuery({positions:etfs}, {
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

    const columns = [
        {
            field: "image",
            headerName: "",
            sortable: false,
            cellClassName: 'actions',
            flex: 0.2,
            renderCell: (p) => {
                return (
                    <Avatar src={`https://invest-brands.cdn-tinkoff.ru/${p.row.info.brand.logoName.replace('.png', 'x160.png')}`}/>
                )
            },
        },
        {
            field: "ISIN",
            headerName: "ISIN",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
        },
        {
            field: "Name",
            headerName: "Наименование",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
        },
        {
            field: "Quantity",
            headerName: "Количество",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
        },
        {
            field: "Price",
            headerName: "Цена",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToMoneyFormat(p.row.Price, p.row.Currency) },
        },
        {
            field: "Amount",
            headerName: "Сумма",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToMoneyFormat(p.row.Amount, p.row.Currency) },
        },
        {
            field: "CurrentPrice",
            headerName: "Текущая цена",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToMoneyFormat(p.row.CurrentPrice, p.row.Currency) },
        },
        {
            field: "Deviation",
            headerName: "Изменение",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToMoneyFormat(p.row.CurrentPrice, p.row.Currency) },
        },
    ]

    return (
        <Box>
            <Box sx={{ mx: 'auto', width: 200 }} >
                <Typography sx={{ml:2, mt:2}} variant="h4">Фонды</Typography>
            </Box>
            <DataGrid
                loading={isLoading}
                sx={{ flexGrow: 1, minWidth:50, overflowY: 'auto' }}
                columns={columns}
                rows={data}
                getRowId={(row) => row.figi}
            />
        </Box>
    )
}