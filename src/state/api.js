import {createApi, fetchBaseQuery, retry} from "@reduxjs/toolkit/query/react";
import {AddMonth, BeginOfMonth, EndOfMonth, ToFloat} from "../helpers/Helper";
import {Build} from "@mui/icons-material";
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
        'Coupon',
        'Share'
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
            queryFn : async (arg, _queryapi, _extraoptions, fetchwithbq) =>{

                if (arg.bonds.length === 0) return {data: []}

                const infoBond = arg.bonds.map(bond  => {
                    return fetchwithbq({
                        url: 'tinkoff.public.invest.api.contract.v1.InstrumentsService/BondBy',
                        body: {idType: '1', id: bond.figi},
                        method: 'POST'
                    }, _queryapi, _extraoptions).then((bond)=> bond.data.instrument);
                });

                const infoBondResult = await Promise.all(infoBond);

                return {
                    data: arg.bonds.map((bond)=>{

                        const info =infoBondResult.find((p)=> p.figi == bond.figi);
                        const quantity = ToFloat(bond.quantity)
                        const currentPrice = ToFloat(bond.currentPrice)

                        return {
                            bond,
                            info,
                            figi: bond.figi,
                            isin: info.isin,
                            name: info.name,
                            quantity,
                            averagePositionPrice: ToFloat(bond.averagePositionPrice),
                            expectedYield: ToFloat(bond.expectedYield),
                            currentNkd: ToFloat(bond.currentNkd),
                            averagePositionPricePt: ToFloat(bond.averagePositionPricePt),
                            currentPrice,
                            amount: currentPrice * quantity,
                            averagePositionPriceFifo: ToFloat(bond.averagePositionPriceFifo),
                            quantityLots: ToFloat(bond.quantityLots),
                            blockedLots: ToFloat(bond.blockedLots),
                            varMargin: ToFloat(bond.varMargin),
                            expectedYieldFifo: ToFloat(bond.expectedYieldFifo),
                            image: `https://invest-brands.cdn-tinkoff.ru/${info?.brand.logoName.replace('.png', 'x160.png')}`,
                            currency: info.currency,
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

        getBondCoupons: build.query({
            queryFn: async (data, _queryapi, _extraoptions, fetchwithbq)=>{

                const numberOfMonths = data.numberOfMonths;

                const startDate = BeginOfMonth(new Date())

                const endDate = AddMonth(startDate, numberOfMonths)

                const couponsPromise = data.bonds.map((row) => {
                    return fetchwithbq({
                        url: 'tinkoff.public.invest.api.contract.v1.InstrumentsService/GetBondCoupons',
                        body: {
                            figi: row.bond.figi,
                            from: startDate.toJSON(),
                            to: endDate.toJSON()
                        },
                        method: 'POST'
                    }, _queryapi, _extraoptions)
                        .then((row)=> row.data.events.map((row)=>{

                            const couponDate = new Date(row.couponDate)
                            const month = couponDate.getMonth() + 1
                            const year = couponDate.getFullYear()
                            return {
                                figi: row.figi,
                                couponDate: row.couponDate,
                                month: month,
                                year: year,
                                period: `${month}/${year}`,
                                couponNumber: row.couponNumber,
                                couponPeriod: row.couponPeriod,
                                payOneBond: ToFloat(row.payOneBond),
                                key: `${row.figi}-${row.couponDate}`
                            }
                        }));
                });

                const coupons = await Promise.all(couponsPromise);

                let result = []
                coupons.forEach((item) => {
                    if (item.length>0) result = result.concat(item)
                });

                return { data: result}
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ key }) => ({ type: 'Coupon', id: key })),
                        { type: 'Coupon', id: 'LIST' },
                    ]
                    : [{ type: 'Coupon', id: 'LIST' }],
        }),

        getShares: build.query({
            queryFn: async (args, _queryapi, _extraoptions, _fetchwithbq) =>{

                const sharesPromises = args.shares.map((share)=>{
                    return _fetchwithbq({
                        url: 'tinkoff.public.invest.api.contract.v1.InstrumentsService/ShareBy',
                        body: {idType: '1', id: share.figi},
                        method: 'POST'
                    }, _queryapi, _extraoptions).then((share)=>share.data.instrument)
                })

                const shares = await Promise.all(sharesPromises)

                return {
                    data: args.shares.map((share)=>{

                        const info =shares.find((row)=> row.figi === share.figi)
                        const quantity = ToFloat(share.quantity)
                        const averagePositionPrice = ToFloat(share.averagePositionPrice)
                        return {
                            share,
                            info: info,
                            figi: share.figi,
                            image: `https://invest-brands.cdn-tinkoff.ru/${info?.brand.logoName.replace('.png', 'x160.png')}`,
                            name: info.name,
                            isin: info.isin,
                            quantity: quantity,
                            averagePositionPrice: averagePositionPrice,
                            amount: quantity * averagePositionPrice,
                            expectedYield: ToFloat(share.expectedYield),
                            currentNkd: ToFloat(share.currentNkd),
                            averagePositionPricePt: ToFloat(share.averagePositionPricePt),
                            currentPrice: ToFloat(share.currentPrice),
                            averagePositionPriceFifo: ToFloat(share.averagePositionPriceFifo),
                            quantityLots: ToFloat(share.quantityLots),
                            blockedLots: ToFloat(share.blockedLots),
                            varMargin: ToFloat(share.varMargin),
                            expectedYieldFifo: ToFloat(share.expectedYieldFifo),
                            currency: info.currency,
                        }
                    })
                }
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ share }) => ({ type: 'Share', id: share.figi })),
                        { type: 'Share', id: 'LIST' },
                    ]
                    : [{ type: 'Share', id: 'LIST' }],
        }),

        getDividends: build.query({
            queryFn: async (args, _queryapi, _extraoptions, _fetchwithbq) =>{

                if (args.positions.length ===0) return {data: []}

                const startDate = new Date()//BeginOfMonth(new Date());
                const endDate = AddMonth(startDate, 12)

                const dividends = []
                for (let i = 0; i < args.positions.length; i++) {

                    let share = args.positions[i]
                    const result = await _fetchwithbq({
                                url: 'tinkoff.public.invest.api.contract.v1.InstrumentsService/GetDividends',
                                body: {
                                    figi: share.figi,
                                    from: startDate.toJSON(),
                                    to: endDate.toJSON()
                                },
                                method: 'POST'
                            }, _queryapi, _extraoptions).then((row)=> row.data.dividends)

                    result.map((row)=> {
                        dividends.push({
                            figi: share.figi,
                            dividend: row,
                            dividendNet: ToFloat(row.dividendNet),
                            lastBuyDate: row.lastBuyDate,
                            paymentDate: row.paymentDate,
                            key: `${share.figi}-${row.lastBuyDate}`
                            })


                    })
                }
                return { data: dividends}
            },
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ key }) => ({ type: 'Dividend', id: key })),
                        { type: 'Dividend', id: 'LIST' },
                    ]
                    : [{ type: 'Dividend', id: 'LIST' }],
        }),

        getEtfs: build.query({
            queryFn: async (args, _queryapi, _extraoptions, _fetchwithbq) =>{

                if (args.etfs.length ===0) return { data: []}

                const infoEtfsPromise = args.etfs.map(etf  => {
                    return _fetchwithbq({
                        url: 'tinkoff.public.invest.api.contract.v1.InstrumentsService/EtfBy',
                        body: {idType: '1', id: etf.figi},
                        method: 'POST'
                    }, _queryapi, _extraoptions).then((bond)=> bond.data.instrument);
                });

                const infoEtfs = await Promise.all(infoEtfsPromise);

                return {
                    data: args.etfs.map((etf)=>{

                        const info = infoEtfs.find((p)=> p.figi == etf.figi)
                        const quantity = ToFloat(etf.quantity)
                        const price = ToFloat(etf.averagePositionPrice)

                        return {
                            bond: etf,
                            info: info,
                            figi: etf.figi,
                            image: `https://invest-brands.cdn-tinkoff.ru/${info.brand.logoName.replace('.png', 'x160.png')}`,
                            Name: info.name,
                            ISIN: info.isin,
                            Quantity: quantity,
                            Price: price,
                            Amount: price * quantity,
                            CurrentPrice: ToFloat(etf.currentPrice),
                            Deviation: ToFloat(etf.expectedYield),
                            Currency: info.currency,
                        }
                    })};

            }
        }),
        providesTags: (result) =>
            result
                ? [
                    ...result.map(({ figi }) => ({ type: 'Etfs', id: figi })),
                    { type: 'Etfs', id: 'LIST' },
                ]
                : [{ type: 'Etfs', id: 'LIST' }],
    })
})

export const {
    useGetAccountsQuery,
    useGetPortfolioQuery,
    useGetBondQuery,
    useGetBondsQuery,
    useGetAllPortfolioQuery,
    useGetBondCouponsQuery,
    useGetSharesQuery,
    useGetDividendsQuery,
    useGetEtfsQuery
} = clientApi