import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light", //dark
    token: null,
    account: "",
    accounts: "",
    portfolio: "",
};

export const globalSlice = createSlice({
    initialState,
    name: "global",
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.token = null;
        },

        setAccount: (state, action)=>{
            state.account = action.payload.account;
        },

        setAccounts: (state, action)=>{
            state.accounts = action.payload.accounts;
        },

        setPortfolio: (state, action)=>{
            state.portfolio = action.payload.portfolio;
        },
    },
});

export const {
    setMode,
    setLogin,
    setLogout,
    setAccount,
    setAccounts,
    setPortfolio,} = globalSlice.actions;

export default globalSlice.reducer;