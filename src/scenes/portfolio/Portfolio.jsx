import Accounts from "../../components/Accounts";
import {useState} from "react";
import {Box, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import {useGetAccountsQuery, useGetAllPortfolioQuery, useGetPortfolioQuery} from "../../state/api";
import * as React from "react";
import {Title} from "@mui/icons-material";
import {Shares} from "../shares/Shares";
import {Bonds} from "../bounds/Bonds";
import {useDispatch} from "react-redux";
import {setAccounts} from "../../state";

export const Portfolio = ({accounts}) => {

    const dispatch = useDispatch();
    const [accountId, setAccountId] = useState()

    const { data: allPortfolio=[], error, isLoading, isFetching, isError } = useGetAllPortfolioQuery(accounts)

    if(isLoading)
        return (<div>Загрузка</div>)

    dispatch(setAccounts(allPortfolio))

    return (
        <Box>
            <Accounts onChange={(id)=>setAccountId(id)}></Accounts>



            {/*<Typography sx={{ml:2}} variant="h5">{`Итого по счету: ${ToFloat(data.totalAmountPortfolio)}`}</Typography>*/}
            {accountId? <Shares accountId={accountId} currency="RUB"/> : ""}
            {accountId? <Bonds accountId={accountId} currency="RUB"/> : ""}
        </Box>
    )
}