import {CssBaseline, ThemeProvider} from "@mui/material";
import {createTheme} from "@mui/material/styles";
import {useSelector} from "react-redux";
import {themeSettings} from "./theme";
import {useMemo, useEffect} from "react";
import {BrowserRouter, Navigate, Routes, Route, useLocation} from "react-router-dom";
import {SignIn} from "./scenes/auth/SignIn";
import {Dashboard} from "./scenes/dashboard/Dashboard";
import Layout from "./scenes/layout/Layout";
import {Portfolio} from "./scenes/portfolio/Portfolio";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(()=>createTheme(themeSettings(mode)), [mode]);
  const token = useSelector((state) => state.global.token);

  return (
      <div className="app">
          <BrowserRouter>
              <ThemeProvider theme={theme}>
                  <CssBaseline/>
                  <ScrollToTop/>
                  <Routes>
                      <Route path="/" element={token=== null ? <SignIn /> : <Navigate to="/dashboard" replace/>} />
                      <Route element={<Layout/>}>
                          <Route path="/dashboard"  element={token != null? <Dashboard /> : <Navigate to="/" replace/>}/>
                          <Route path="/portfolio"  element={token != null? <Portfolio /> : <Navigate to="/" replace/>}/>
                      </Route>
                  </Routes>
              </ThemeProvider>
          </BrowserRouter>
      </div>)
}

export default App;
