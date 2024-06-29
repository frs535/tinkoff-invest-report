import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './Routes';
import {
    AppProvider,
    BreakpointsProvider,
    SettingsPanelProvider,
    ChatWidgetProvider,
    Conversation,
} from "@frs535/react-ui-components";
import { RouterProvider } from 'react-router-dom';

import './css/theme.min.css';
import './css/theme.min.rtl.css';
import './css/user.min.rtl.css';
import './css/user.min.rtl.css';

const supportChat: Conversation = {
    id: 1,
    user: { id: 1, avatar: '', status: 'online', name: 'Test' },
    messages: []
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AppProvider>
            <SettingsPanelProvider>
                <ChatWidgetProvider supportChat={supportChat} >
                    <BreakpointsProvider>
                        <RouterProvider router={router}/>
                    </BreakpointsProvider>
                </ChatWidgetProvider>
            </SettingsPanelProvider>
        </AppProvider>
    </React.StrictMode>,
)
