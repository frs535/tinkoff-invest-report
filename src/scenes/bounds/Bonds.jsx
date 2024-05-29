import {
    useGetBondsQuery,
    useGetBondCouponsQuery
} from "../../state/api";
import {
    Avatar,
    Box,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import * as React from "react";
import {useState} from "react";
import {ToNumber} from "../../helpers/Helper";
import {DataGrid} from "@mui/x-data-grid";
import { BarChart } from '@mui/x-charts/BarChart';

export const Bonds = ({bonds}) => {

    const [numberOfMonths, setNumberOfMonths] = useState(12);

    const { data: bondsInfo=[], error, isLoading, refetch, isError } = useGetBondsQuery({bonds: bonds})

    const { data: coupons=[], error: errorCoupons, isLoading: isLoadingCoupons, isErrorCoupons} = useGetBondCouponsQuery({bonds: bondsInfo, numberOfMonths},
        {
            skip: bondsInfo.length ===0,
    })

    if (bonds.length === 0) return ""

    if (isLoading || isLoadingCoupons)
        return (<div>Загрузка</div>)

    if (isError)
        return (
            <Box>
                <div>{error.message}</div>
            </Box>
        )

    if (isErrorCoupons)
        return (
            <Box>
                <div>{errorCoupons.message}</div>
            </Box>
        )

    const columns = [
        {
            field: "image",
            headerName: "",
            sortable: false,
            cellClassName: 'actions',
            flex: 0.1,
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
            flex: 0.4,
        },
        {
            field: "name",
            headerName: "Наименование",
            headerAlign: "left",
            align: "left",
            flex: 0.5,
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
            headerName: "Кол",
            description: 'Количество в портфеле',
            headerAlign: "left",
            align: "left",
            flex: 0.18,
        },
        {
            field: "averagePositionPrice",
            headerName: "Цена",
            description: 'Средняя цена приобритения',
            headerAlign: "left",
            align: "left",
            flex: 0.22,
            renderCell: p => { return ToNumber(p.row.averagePositionPrice) },
        },
        {
            field: "currentPrice",
            headerName: "Тек. цена",
            description: 'Текущая биржевая цена',
            headerAlign: "left",
            align: "left",
            flex: 0.22,
            renderCell: p => { return ToNumber(p.row.currentPrice) },
        },
        {
            field: "amount",
            headerName: "Сумма",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToNumber(p.row.amount) },
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
            field: "currentNkd",
            headerName: "Купон",
            headerAlign: "left",
            align: "left",
            flex: 0.3,
            renderCell: p => { return ToNumber(p.row.currentNkd) },
        },
    ]

    const dataTotal = []
    const dataTotalStacked = []
    const currentDate = new Date()
    for (let i = 0; i < numberOfMonths; i++) {

        const date = new Date(currentDate)
        date.setMonth(date.getMonth() + i)

        columns.push({
            field: `field_M${date.getMonth() + 1}_Y${date.getFullYear()}`,
            headerName: `${date.getMonth() + 1}/${date.getFullYear()}`,
            headerAlign: "left",
            align: "left",
            flex: 0.22,
            renderCell: p =>
            {

                let currentString =  p.field.slice(p.field.indexOf('_M')+2)
                const month = parseInt(currentString.slice(0, currentString.indexOf('_Y')))
                const year =  parseInt(currentString.slice(currentString.indexOf('_Y') + 2))

                const result = coupons.find((coupon) =>
                    coupon.figi === p.id && coupon.year === year && coupon.month === month)
                if (result){
                    const amount = p.row.quantity * result.payOneBond
                    return Math.round(amount * 100) / 100//ToMoneyFormat(amount, p.row.currency)
                }

                return ""
            },
            // valueGetter: (value) => {
            //     if (!value) {
            //         return value;
            //     }
            //     return value * 100;
            // },
        })

        const month = date.getMonth() + 1
        const year =  date.getFullYear()

        const montlyCoupons = coupons.filter((coupon)=> coupon.year === year && coupon.month === month)
        const monthTotal = montlyCoupons.
            reduce((acc, curr)=>{
                const result = bondsInfo.find((bond)=> bond.figi === curr.figi)

            return result? acc + curr.payOneBond * result.quantity: acc + curr.payOneBond
        }, 0)

        dataTotal.push({
            'month': `${month}/${year}`,
            'amount': Math.round(monthTotal * 100) / 100,
            'data': montlyCoupons.map((coupon)=> {
                return{
                    'amount': coupon.payOneBond,
                    'figi': coupon.figi
                }
            }),
        })
    }

    bondsInfo.forEach((bond)=> {

        const data=[]
        for (let i = 0; i < numberOfMonths; i++) {

            const date = new Date(currentDate)
            date.setMonth(date.getMonth() + i)
            const month = date.getMonth() + 1
            const year =  date.getFullYear()

            const value = coupons.find((coupon)=> coupon.figi === bond.figi && coupon.year === year && coupon.month === month)
            data.push(value?value.payOneBond: 0)
        }

        dataTotalStacked.push({
            stack: 'total',
            data: data,
            label: bond.figi
        })
    })

    const columnsTotal =[
        {
            field: "month",
            headerName: "Месяц",
            sortable: true,
            flex: 1,
        },
        {
            field: "amount",
            headerName: "Сумма",
            sortable: true,
            flex: 1,
        },
    ]

    return (
        <Box>
            <Box sx={{
                mx: 'auto',
                width: 200,
                display: "flex",
            }} >
                <Typography sx={{ml:2, mt:1}} component="h1" variant="h4" >Облигации</Typography>
                <IconButton onClick={()=>{ refetch()}}>
                    <RefreshIcon/>
                </IconButton>
            </Box>
            <Box sx={{ ml:1, mb:1, lm: '20px' }}>
                <TextField label="Месяцы"
                           type="number"
                           inputProps={{ type: 'number', shrink: true}}
                           size="small"
                           value={numberOfMonths}
                           onChange={(e)=> setNumberOfMonths(parseInt(e.target.value))}/>
            </Box>
            <DataGrid
                loading={isLoading}
                sx={{ flexGrow: 1, minWidth:50, overflowY: 'auto' }}
                columns={columns}
                rows={bondsInfo}
                getRowId={(row) => row.figi}
                rowHeight={35}
            />
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <DataGrid
                    loading={isLoading}
                    sx={{ minWidth:50, maxWidth: 250, maxHeight: 370 }}
                    columns={columnsTotal}
                    rows={dataTotal}
                    getRowId={(row) => row.month}
                    hideFooter={true}
                    rowHeight={25}
                />
                <BarChart
                    dataset={dataTotal}
                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[{ dataKey: 'amount', label: 'Дивиденд по месяцам' }]}
                    width={700}
                    height={350}
                />
            </Box>
        </Box>
    )
}