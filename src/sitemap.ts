import {RouteItems} from "@frs535/react-ui-components";
import {
    UilChartPie
} from '@iconscout/react-unicons';

export const routes: RouteItems[] = [
    {
        label: 'dashboard',
        horizontalNavLabel: 'home',
        active: true,
        icon: UilChartPie,
        labelDisabled: true,
        pages: [
            {
                name: 'Portfolio',
                path: '/',
                pathName: 'default-dashboard',
                topNavIcon: 'shopping-cart',
                active: true
            },
            {
                name: 'project-management',
                path: '/Portfolio',
                pathName: 'project-management-dashbaord',
                topNavIcon: 'clipboard',
                active: true
            },
        ]
    }
]