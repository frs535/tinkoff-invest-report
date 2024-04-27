import {retry} from "@reduxjs/toolkit/query/react";

export function ToFloat(item, currency){

    if (!item && currency)
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUR' }).format(0,)

    if (!item && !currency) return 0;

    const units = parseFloat(item.units?.replace(",", "."));
    const nano = item.nano? Math.round(item.nano/10000000) / 100 : 0;

    const result = units + nano;

    if (currency)
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUR' }).format(result,);

    return result;
}

export function ToMoneyFormat(value, currency){
    if (!value) return 0

    if(currency == "rub")
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUR' }).format(value,)

    if (!currency)
        return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUR' }).format(value,)

    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency }).format(value,)
}

export function ToLocalDate(value){
    if (!value) return ""

    //new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
    return value.toLocaleDateString('ru-ru', { year:"numeric", month:"short", day:"numeric"})
}

export function ToPercent(value) {

    const formatter = new Intl.NumberFormat("en-US", {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return formatter.format(value);
}

export function BeginOfMonth(date){

    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)

    return date
}

export function EndOfMonth(date){

    const current = new Date(date)
    current.setMonth(date.getMonth() + 1)
    current.setDate(1)
    current.setHours(0)
    current.setMinutes(0)
    current.setSeconds(0)
    current.setMilliseconds(0)
    current.setSeconds(-1)

    return current
}

export function AddMonth(date, months)
{
    const endDate = new Date(date);
    endDate.setMonth(endDate.getMonth()  + months)

    return endDate
}

export function DiffDate(startDate, endDate)
{
    const diffTime = Math.abs(startDate - endDate);
    return  Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}