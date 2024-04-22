import * as React from 'react';
import {useGetAccountsQuery} from "../state/api";
import {Autocomplete, Box, TextField} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import {useState} from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {setAccount} from "../state";
import {useDispatch} from "react-redux";

const Accounts = ({onChange}) => {

    const [currentAcccount, setCurrentAccount] = useState();
    const dispatch = useDispatch();

    const { data=[], error, isLoading, isFetching, isError } = useGetAccountsQuery();

    if (isLoading)
        return (<div>Загрузка</div>);

    if (isError)
        return (
            <Box>
                <div>{error.data.status}</div>
                <div>{error.data.error}</div>
            </Box>
        );

    const handleChange = (event) => {

        setCurrentAccount(event.target.value);
        dispatch(setAccount(event.target.value))

        if (onChange)
            onChange(event.target.value)
    };

    return (
        <Box>
            <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
                <InputLabel id="account-id">Счет</InputLabel>
                <Select
                    labelId="account-id"
                    id="account"
                    value={currentAcccount}
                    label="Брокерский счет"
                    onChange={handleChange}
                >
                    {
                        data?.accounts?.map(selectedAcc=>{return (<MenuItem value={selectedAcc.id}>{selectedAcc.name}</MenuItem>)})
                    }
                </Select>
            </FormControl>
        </Box>
    )
}

export  default Accounts