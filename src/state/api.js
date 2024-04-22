import {createApi, fetchBaseQuery, retry} from "@reduxjs/toolkit/query/react";
const baseUrl = `https://invest-public-api.tinkoff.ru/rest/`;

const baseQuery = retry(fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState })=>{
        const state = getState();
        if (state){
            headers.set('Authorization', `Bearer ${state.global.token}`)
            headers.set('accept', 'application/json')
            headers.set('Content-type','application/json')
            return headers
        }
    }
}), {maxRetries:5});

export const clientApi = createApi({
    baseQuery: baseQuery,
    reducerPath: "clientApi",
    tagTypes: [
       `Accounts`,
        'Portfolio',
        'Bond',
        'Bonds',
        'Coupon'
    ],
    endpoints: (build) => ({

        getAccounts: build.query({
            query: () => ({
                url: '/tinkoff.public.invest.api.contract.v1.UsersService/GetAccounts',
                method: "POST",
                body: {},
            }),
            providesTags: ['Accounts'],
        }),

        getPortfolio: build.query({
            query :(data)=> ({
                url: 'tinkoff.public.invest.api.contract.v1.OperationsService/GetPortfolio',
                method: 'POST',
                body: {accountId : data.accountId, currency: data.currency}
            }),
            providesTags: ["Portfolio"],
        }),

        getAllPortfolio: build.query({
            queryFn: async (args, _queryapi, _extraoptions, _fetchwithbq)=>{

                const allPortfolioPromise = args.map((account) =>{
                    return _fetchwithbq({
                        url: 'tinkoff.public.invest.api.contract.v1.OperationsService/GetPortfolio',
                        method: 'POST',
                        body: JSON.stringify({
                            "accountId": `${account.id}`,
                            "currency": `RUB`
                        })
                    }, _queryapi, _extraoptions)
                        .then((result)=> result.data)
                });

                const result = await Promise.all(allPortfolioPromise)

                return {data: result }
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ accountId }) => ({ type: 'Portfolio', id: accountId })),
                        { type: 'Portfolio', id: 'LIST' },
                    ]
                    : [{ type: 'Portfolio', id: 'LIST' }],
        }),

        getBond: build.query({
            query: (figi)=>({
                url: 'tinkoff.public.invest.api.contract.v1.InstrumentsService/BondBy',
                method: 'POST',
                body: {idType: "1", id: figi }
            }),
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ figi }) => ({ type: 'Bond', figi })), 'Bond']
                    : ['Bond'],
            transformResponse: (response) => {
                // приводим данные ответа к нужному формату
                const posts = response.map((post) => ({
                    ...post,
                    date: new Date(),
                }));
                return posts;
            }
        }),

        getBonds: build.query({
            queryFn : async (data, _queryapi, _extraoptions, fetchwithbq) =>{

                const portfolio = await fetchwithbq({
                    url: 'tinkoff.public.invest.api.contract.v1.OperationsService/GetPortfolio',
                    method: 'POST',
                    body: JSON.stringify({
                        "accountId": `${data.accountId}`,
                        "currency": `${data.currency}`
                    }),
                }, _queryapi, _extraoptions);

                const bonds = portfolio.data.positions.filter(row => row.instrumentType === 'bond');
                const infoBond = bonds.map(bond  => {
                    return fetchwithbq({
                        url: 'tinkoff.public.invest.api.contract.v1.InstrumentsService/BondBy',
                        body: {idType: '1', id: bond.figi},
                        method: 'POST'
                    }, _queryapi, _extraoptions).then((bond)=> bond.data.instrument);
                });

                const infoBondResult = await Promise.all(infoBond);

                return {
                    data: bonds.map((bond)=>{
                        return {
                            bond,
                            info: infoBondResult.find((p)=> p.figi == bond.figi)
                        }
                    })};
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ bond }) => ({ type: 'Bonds', id: bond.figi })),
                        { type: 'Bonds', id: 'LIST' },
                    ]
                    : [{ type: 'Bonds', id: 'LIST' }],
        }),
    })
})

export const {
    useGetAccountsQuery,
    useGetPortfolioQuery,
    useGetBondQuery,
    useGetBondsQuery,
    useGetAllPortfolioQuery,
} = clientApi