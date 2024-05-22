import {Box} from "@mui/material";
import {useGetAccountsQuery, useGetAllPortfolioQuery} from "../../state/api";
import * as React from "react";
import {useState} from "react";
import {Shares} from "../shares/Shares";
import {Bonds} from "../bounds/Bonds";
import {Etfs} from "../etf/Etfs";
import {Currencies} from "../currencies/Currencies";
import {ToAverage} from "../../helpers/Helper";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

function unionPosition(position1, position2) {

    return {
        figi: position1.figi,
        instrumentType: position1.instrumentType,
        positionUid: position1.positionUid,
        instrumentUid: position1.instrumentUid,
        blocked: position1.blocked,
        quantity: position1.quantity + position2.quantity,
        averagePositionPrice: ToAverage(position1.averagePositionPrice, position2.averagePositionPrice),
        expectedYield: ToAverage(position1.expectedYield, position2.expectedYield),
        averagePositionPricePt: ToAverage(position1.averagePositionPricePt, position2.averagePositionPricePt),
        currentPrice: position1.currentPrice,
        averagePositionPriceFifo: ToAverage(position1.averagePositionPriceFifo, position2.averagePositionPriceFifo),
        quantityLots: position1.quantityLots,
        blockedLots: position1.blockedLots,
        varMargin: position1.varMargin,
        expectedYieldFifo: ToAverage(position1.expectedYieldFifo, position2.expectedYieldFifo),
        currentNkd: position1?.currentNkd ? position1.currentNkd : 0,
    }
}

function getPositions(accounts, instrumentType){

    const result = []
    accounts.forEach((account) => {
        const positions = account.positions.filter((p)=>p.instrumentType === instrumentType);

        if (positions === undefined || positions == null) {
            console.log(positions)
        }
        positions.forEach((position)=>{

            const foundPosition = result.find((p)=>p.figi == position.figi)
            if (foundPosition) {

                const index = result.indexOf(foundPosition)
                result.splice(index, 1)
                const uniPos = unionPosition(foundPosition, position)
                result.push(uniPos)
            }
            else
                result.push(position)
        });
    })
    return result;
}

export const Dashboard = () => {

    const [currentActive= '', setCurrentActive] = useState()
    const { data, error, isLoading, isError } = useGetAccountsQuery()

    const { data: portfolio=[], error: errorAcc, isLoading: isLoadingAcc = false, isError: isErrorAcc } = useGetAllPortfolioQuery(data?.accounts, {
        skip: data === undefined,
    })

    if (isError || isErrorAcc)
        return (
            <Box>
                <div>{error?.message}</div>
                <div>{errorAcc?.message}</div>
            </Box>
        )

    if (isLoading || isLoadingAcc)
        return (<div>Загрузка</div>)

    return (
        <Box>
            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                <InputLabel id="typeOfActive-id">Вид</InputLabel>
                <Select
                    labelId="typeOfActive-id"
                    id="typeOfActive"
                    value={currentActive}
                    label="Актив"
                    onChange={(e)=> setCurrentActive(e.target.value)}
                >
                    <MenuItem value={'share'}>Акции</MenuItem>
                    <MenuItem value={'bond'}>Облигации</MenuItem>
                    <MenuItem value={'etf'}>Фонды</MenuItem>
                    <MenuItem value={'currency'}>Валюта</MenuItem>
                </Select>
            </FormControl>

            {currentActive === 'share'? <Shares shares={getPositions(portfolio, 'share')}/>: ""}
            {currentActive === 'bond'? <Bonds bonds={getPositions(portfolio, 'bond')}/>: ""}
            {currentActive === 'etf'? <Etfs etfs={getPositions(portfolio, 'etf')}/>: ""}
            {currentActive === 'currency'? <Currencies currencies={getPositions(portfolio, 'currency')}/>: ""}
        </Box>
    )
}