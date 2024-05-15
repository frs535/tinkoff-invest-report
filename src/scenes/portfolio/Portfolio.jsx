import Accounts from "../../components/Accounts";
import {useState} from "react";
import {Box, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import {useGetAccountsQuery, useGetAllPortfolioQuery, useGetPortfolioQuery} from "../../state/api";
import * as React from "react";
import {Title} from "@mui/icons-material";
import {Shares} from "../shares/Shares";
import {Bonds} from "../bounds/Bonds";
import {useDispatch} from "react-redux";
import {setAccount, setAccounts} from "../../state";
import {Etfs} from "../etf/Etfs";
import {Currencies} from "../currencies/Currencies";

export const Portfolio = ({accounts}) => {

    const dispatch = useDispatch();
    const [currentAccountId, setCurrentAccountId] = useState()
    const [currentPortfolio, setCurrentPortfolio] = useState()

    const { data: allPortfolio=[], error, isLoading = false, isFetching, isError } = useGetAllPortfolioQuery(accounts)

    if(isLoading)
        return (<div>Загрузка</div>)

    if (isError)
        return (
            <Box>
                <div>{error.message}</div>
            </Box>
        )

    dispatch(setAccounts(allPortfolio))

    return (
        <Box>
            <Box sx={{ ml: 3 }}>
                <Accounts onChange={(id)=>{
                    dispatch(setAccount(id))
                    setCurrentAccountId(id)
                    setCurrentPortfolio(allPortfolio.find((portfolio)=> portfolio.accountId === id))
                }}/>
            </Box>

            {/*<Typography sx={{ml:2}} variant="h5">{`Итого по счету: ${ToFloat(data.totalAmountPortfolio)}`}</Typography>*/}

            {currentAccountId? <Shares shares={currentPortfolio.positions.filter((postition)=> postition.instrumentType === 'share')}/> : ""}
            {currentPortfolio? <Bonds bonds={currentPortfolio.positions.filter((postition)=> postition.instrumentType === 'bond')}/> : ""}
            {currentAccountId? <Etfs etfs={currentPortfolio.positions.filter((postition)=> postition.instrumentType === 'etf')}/> : ""}
            {currentPortfolio? <Currencies currencies={currentPortfolio.positions.filter((postition)=> postition.instrumentType === 'currency')}/> : ""}
        </Box>
    )
}