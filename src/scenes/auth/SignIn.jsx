import {Avatar, Box, Button, Container, TextField, Typography} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setAccount, setLogin} from "../../state";
import {useState} from "react";
import {useGetAccountsQuery} from "../../state/api";
import * as React from "react";

export const SignIn = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [tokenError, setTokenError] = useState(false);
    const [tokenErrorText, setTokenErrorText] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const token = data.get('token');

        if (token.trim() === "")
        {
            setTokenError(true);
            setTokenErrorText("Введите токен")
            return;
        }

        const loggedInResponse = await fetch( `https://invest-public-api.tinkoff.ru/rest/tinkoff.public.invest.api.contract.v1.UsersService/GetInfo`, {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
        });

        if (loggedInResponse.status !== 200){
            setTokenError(true)
            setTokenErrorText('Ошибка входа')
            return;
        }

        setTokenError(false);

        dispatch(
            setLogin({
                token: token,
            })
        );
        navigate("/dashboard");
    };

    return (
        <Container>
            <Box sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Введите токен
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="token"
                        label="Токен"
                        name="token"
                        autoFocus
                        error={tokenError}
                        helperText={
                            tokenError ? tokenErrorText : ""
                        }
                    />
                    <Button
                        color="primary"
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Вход
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}