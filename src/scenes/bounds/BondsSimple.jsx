import {
    useGetBondsQuery,
    useGetBondCouponsQuery
} from "../../state/api";
import {
    Avatar,
    Box,
    Checkbox, IconButton,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import * as React from "react";
import { useState} from "react";
import {AddMonth, BeginOfMonth, DiffDate, EndOfMonth, ToMoneyFormat, ToPercent} from "../../helpers/Helper"

function GetInvestPercent(figi, coupons, cost){

    const current = coupons.filter((coupon)=> coupon.figi ===figi)
    if (current.length===0) return 0

    const startDate = BeginOfMonth(new Date())

    const endDate = AddMonth(startDate, 12)

    const annualDays    = DiffDate(startDate, endDate)

    let maxDate = new Date();
    current.forEach((row)=>{
        const currentDate = new Date(row.couponDate)
        if (currentDate > maxDate){
            maxDate = currentDate
        }
        else{
            console.log(maxDate)
            console.log(currentDate)
        }

    })

    maxDate = EndOfMonth(maxDate)

    const nkdDays = DiffDate(startDate, maxDate)

    const amount = current.reduce((result, value) => {
        return result + value.payOneBond;
    },0);

    const result = annualDays * amount / nkdDays / cost

    return ToPercent(result)
}

export const Bonds = ({bonds}) => {

    const [numberOfMonths, setNumberOfMonths] = useState(12);

    const { data: bondsInfo=[], error, isLoading, isFetching, refetch, isError } = useGetBondsQuery({bonds: bonds})

    const { data: coupons=[], error: errorCoupons, isLoading: isLoadingCoupons} = useGetBondCouponsQuery({bonds: bondsInfo, numberOfMonths},
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

    var counter = 0;
    return (
        <Box>
            <Box sx={{
                mx: 'auto',
                width: 400,
                display: "flex",
            }} >
                <Typography sx={{ml:2, mt:1}} variant="h4" >Облигации</Typography>
                <IconButton onClick={()=>{ refetch()}}>
                    <RefreshIcon/>
                </IconButton>
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
                        <TableCell></TableCell>
                        <TableCell>Наименование</TableCell>
                        <TableCell>ISIN</TableCell>
                        <TableCell>Количество</TableCell>
                        <TableCell>Цена </TableCell>
                        <TableCell>Сумма</TableCell>
                        <TableCell>Текущая цена</TableCell>
                        <TableCell>Изменение</TableCell>
                        <TableCell>НКД</TableCell>
                        <TableCell>Инвест процент</TableCell>
                        <TableCell align="right">Заблокирована</TableCell>
                        {
                            numberOfMonths > 0 ? new Array(numberOfMonths)
                                    .fill(counter++,)
                                    .map((number, index)=>{
                                        const currentDate = new Date()
                                        const date = new Date(currentDate)
                                        date.setMonth(date.getMonth() + index)
                                        return <TableCell>{`${date.getMonth() + 1}/${date.getFullYear()}`}</TableCell>
                                    })
                            : ""
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        bondsInfo?.map((row)=>(
                            <TableRow key={row.figi}>
                                <TableCell>
                                    <Avatar src={`https://invest-brands.cdn-tinkoff.ru/${row.info.brand.logoName.replace('.png', 'x160.png')}`}/>
                                </TableCell>
                                <TableCell>{row.info.name}</TableCell>
                                <TableCell>{row.info.isin}</TableCell>
                                <TableCell>{row.quantity}</TableCell>
                                <TableCell>{ToMoneyFormat(row.averagePositionPrice, row.info.currency)}</TableCell>
                                <TableCell>{ToMoneyFormat(row.quantity * row.averagePositionPrice, row.info.currency)}</TableCell>
                                <TableCell>{ToMoneyFormat(row.currentPrice, row.info.currency)}</TableCell>
                                <TableCell>{ToMoneyFormat(row.expectedYieldFifo, row.info.currency)}</TableCell>
                                <TableCell>{ToMoneyFormat(row.currentNkd, row.info.currency)}</TableCell>
                                <TableCell>{GetInvestPercent(row.figi, coupons, row.averagePositionPrice)}</TableCell>
                                <TableCell>{<Checkbox disabled checked={row.bond.blocked} />}</TableCell>
                                {
                                    numberOfMonths > 0 ? new Array(numberOfMonths)
                                            .fill(0)
                                            .map((number, index)=>{

                                                const currentDate = new Date()
                                                const date = new Date(currentDate)
                                                date.setMonth(date.getMonth()  + index)
                                                const month = date.getMonth() + 1
                                                const year = date.getFullYear()

                                                const result = coupons.find((coupon)=>
                                                    coupon.figi == row.bond.figi && coupon.month==month && coupon.year ==year)

                                                if (result)
                                                {
                                                    const amount = row.quantity * result.payOneBond
                                                    return <TableCell>{ToMoneyFormat(amount, row.info.currency)}</TableCell>
                                                }
                                                return <TableCell></TableCell>
                                            })
                                        : ""
                                }
                            </TableRow>
                        ))}
                </TableBody>
                <TableFooter>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Итого:</TableCell>
                    {
                        numberOfMonths > 0 ? new Array(numberOfMonths)
                                .fill(0)
                                .map((number, index)=>{

                                    const currentDate = new Date()
                                    const date = new Date(currentDate)
                                    date.setMonth(date.getMonth()  + index)
                                    const month = date.getMonth() + 1
                                    const year = date.getFullYear()

                                    const result = coupons.filter((coupon)=> coupon.month==month && coupon.year ==year)
                                    let amount = 0;
                                    result.forEach((item)=>{
                                        const bond = bondsInfo.find((bond)=> bond.bond.figi == item.figi)
                                        amount = amount + bond.quantity * item.payOneBond;
                                    })

                                    return <TableCell>{ToMoneyFormat(amount)}</TableCell>
                                })
                            : ""
                    }
                </TableFooter>
            </Table>
        </Box>
    )
}