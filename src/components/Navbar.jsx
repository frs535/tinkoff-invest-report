import {AppBar, Box, Button, IconButton, Toolbar} from "@mui/material";
import {
    Menu as MenuIcon,
} from "@mui/icons-material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setLogout} from "../state";
import {clientApi} from "../state/api";

const Navbar = ({isSidebarOpen, setIsSidebarOpen}) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <AppBar
            sx={{
                position: "static",
                background: "none",
                boxShadow: "none",
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    }}
            >
                {/* LEFT SIDE */}
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <MenuIcon />
                    </IconButton>
                </Box>

                {/* RIGHT SIDE */}
                <Box gap="1.5rem">
                    <IconButton onClick={()=>{
                        dispatch(clientApi.util.resetApiState());
                        dispatch(setLogout());
                        navigate("/dashboard");
                    }}>
                        <AccountCircle/>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar