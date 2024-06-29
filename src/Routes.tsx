import App from './App';
// import React, {lazy} from "react";
import { RouteObject, createBrowserRouter } from 'react-router-dom';
import {MainLayout, MainLayoutProvider} from "@frs535/react-ui-components";
import {routes as routeSite} from './sitemap'
import Portfolio from "./pages/Portfolio.tsx";

// const FontAwesomeExample = lazy(
//     () => import('pages/modules/components/FontAwesomeExample')
// );
//
// const FeatherIconsExample = lazy(
//     () => import('pages/modules/components/FeatherIconsExample')
// );
//
// const UniconsExample = lazy(
//     () => import('pages/modules/components/UniconsExample')
// );

const routes: RouteObject[]=[
    {
        element: <App />,
        children:[
            {
                path: '/',
                element: (
                    <MainLayoutProvider>
                        <MainLayout routes={routeSite}></MainLayout>
                    </MainLayoutProvider>
                ),
                children:[
                    {
                        index: true,
                        element: <Portfolio/>
                    },
                    {
                        path: '/dashboard',
                        children: [
                            {
                                path: 'project-management',
                                element: <Portfolio />
                            },
                            {
                                path: 'crm',
                                element: <Portfolio />
                            }
                        ]
                    },
                ]
            }
        ]
    }
];

export const router = createBrowserRouter(routes);

export default routes;
