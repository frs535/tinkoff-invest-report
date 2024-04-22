import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import globalReducer from "./state/index";
import {Provider} from "react-redux";
import {setupListeners} from "@reduxjs/toolkit/query";
import {clientApi} from "./state/api";

/* Auth */
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {PersistGate} from "redux-persist/integration/react";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./dev";

const rootReducer = combineReducers({
    global: globalReducer,
    [clientApi.reducerPath]: clientApi.reducer,
});

const persistConfig = {key: "root", storage, version: 1};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) => getDefault({
        // serializableCheck: {
        //     ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // },
    }).concat(clientApi.middleware),
});

setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistStore(store)}>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}>
                    <App/>
                </DevSupport>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);
