import {Box} from "@mui/material";
import {Portfolio} from "../portfolio/Portfolio";
import {useGetAccountsQuery, useGetAllPortfolioQuery, useGetBondsQuery} from "../../state/api";
import {useState} from "react";
import Accounts from "../../components/Accounts";
import {Shares} from "../shares/Shares";
import {Bonds} from "../bounds/Bonds";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import {setAccounts} from "../../state";

export const Dashboard = () => {

    // const navigate = useNavigate();
    const dispatch = useDispatch();

    const [accountId, setAccountId] = useState()

    const { data: accounts=[], error, isLoading, isFetching, isError } = useGetAccountsQuery()

    if (isLoading)
        return (<div>Загрузка</div>)

    dispatch(setAccounts(accounts));

    return (
        <Box>
            <Portfolio accounts={accounts.accounts}/>
        </Box>
    )
}