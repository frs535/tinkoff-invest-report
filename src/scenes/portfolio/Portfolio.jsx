import Accounts from "../../components/Accounts";
import {useState} from "react";
import {Box} from "@mui/material";
import {useGetAccountsQuery, useGetAllPortfolioQuery} from "../../state/api";
import * as React from "react";
import {Shares} from "../shares/Shares";
import {Bonds} from "../bounds/Bonds";
import {useDispatch} from "react-redux";
import {setAccount} from "../../state";
import {Etfs} from "../etf/Etfs";
import {Currencies} from "../currencies/Currencies";

export const Portfolio = () => {

    const dispatch = useDispatch();
    const [currentAccountId, setCurrentAccountId] = useState()
    const [currentPortfolio, setCurrentPortfolio] = useState()

    const { data= {accounts: []}, error:errorAcc , isLoading: isLoadingAccounts, isError: accIsError} = useGetAccountsQuery()

    const { data: allPortfolio=[], error, isLoadingPortfolio, isError } = useGetAllPortfolioQuery(data.accounts,{
        skip: data.accounts.length === 0,
    })

    if(isLoadingPortfolio || isLoadingAccounts)
        return (<div>Загрузка</div>)

    if (isError)
        return (
            <Box>
                <div>{error.message}</div>
            </Box>
        )

    if (accIsError)
        return (
            <Box>
                <div>{errorAcc.message}</div>
            </Box>
        )

    return (
        <Box>
            <Box sx={{ ml: 3 }}>
                <Accounts onChange={(id)=>{
                    dispatch(setAccount(id))
                    setCurrentAccountId(id)
                    if (allPortfolio.length>0)
                        setCurrentPortfolio(allPortfolio.find((portfolio)=> portfolio.accountId === id))
                }}/>
            </Box>

            {currentAccountId? <Shares shares={currentPortfolio?.positions.filter((postition)=> postition.instrumentType === 'share')}/> : ""}
            {currentPortfolio? <Bonds bonds={currentPortfolio?.positions.filter((postition)=> postition.instrumentType === 'bond')}/> : ""}
            {currentAccountId? <Etfs etfs={currentPortfolio?.positions.filter((postition)=> postition.instrumentType === 'etf')}/> : ""}
            {currentPortfolio? <Currencies currencies={currentPortfolio?.positions.filter((postition)=> postition.instrumentType === 'currency')}/> : ""}
        </Box>
    )
}