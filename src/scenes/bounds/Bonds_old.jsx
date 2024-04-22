import * as React from 'react';
import {Autocomplete, Box, TextField} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import {useGetAccountsQuery, useGetPortfolioQuery, useGetBondsQuery} from "../../state/api";
import { DataGrid } from '@mui/x-data-grid';
import {useState} from "react";
import {useSelector} from "react-redux";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const BondTable = ({account})=>{

    // const token = useSelector((state) => state.global.token);
    // // const { data, error, isLoading, isFetching, isError } = useGetPortfolioQuery({accountId: account, currency: 'RUB' });
    // const { data, error, isLoading, isFetching, isError } = useGetBondsQuery({account, token});
    //
    // if (isError)
    //     return (
    //         <Box>
    //             <div>{error?.status}</div>
    //             <div>{error?.data?.message}</div>
    //         </Box>
    //     );
    //
    // if (isLoading)
    //     return (
    //       <div>Loading</div>
    //     );
    //
    // const columns = [
    //     { field: 'figi', headerName: 'figi', width: 140 },
    //     {
    //         field: 'quantity',
    //         headerName: 'Количество',
    //         width: 150,
    //         editable: false,
    //         valueGetter: p =>p.row.quantity?.units,
    //     },
    //     {
    //         field: 'currentNkd',
    //         headerName: 'НКД',
    //         width: 150,
    //         editable: false,
    //         valueGetter: p =>`${p.row.currentNkd?.units + p.row.currentNkd?.nano/1000000000} ${p.row.currentNkd?.currency}`,
    //     },
        // {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: (params) =>
        //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        // },
    // ];

    return(
        <div></div>
        // <DataGrid
        //     columns={columns}
        //     rows={data?.positions?.filter(p=>p.instrumentType === 'bond')}
        //     loading={isLoading}
        //     getRowId={row=>row.figi}
        // />
    )
}

const Bonds_old = () => {

    // const [acccount, setAccount] = useState();
    //
    // const { data=[], error, isLoading, isFetching, isError } = useGetAccountsQuery();
    //
    // if (isError)
    //     return (
    //         <Box>
    //             <div>{error.data.status}</div>
    //             <div>{error.data.error}</div>
    //         </Box>
    //     );
    //
    // const handleChange = (event) => {
    //     setAccount(event.target.value);
    // };

    return ( <div></div>
        // <Box>
        //     <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
        //         <InputLabel id="account-id">Брокерский счет</InputLabel>
        //         <Select
        //             labelId="account-id"
        //             id="account"
        //             value={acccount}
        //             label="Брокерский счет"
        //             onChange={handleChange}
        //         >
        //             {
        //                 data?.accounts?.map(selectedAcc=>{return (<MenuItem value={selectedAcc.id}>{selectedAcc.name}</MenuItem>)})
        //             }
        //         </Select>
        //     </FormControl>
        //     {
        //         acccount? <BondTable account={acccount}/>:""
        //     }
        // </Box>
    )
}

export default Bonds_old;