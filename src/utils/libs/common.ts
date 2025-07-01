import { useLocation } from "react-router-dom"
import { getLocalStorage, setLocalStorage } from "./localStorage"

export function asset_url(url: string) {
    return window.location.origin + '/' + url
}

export function matchCurrentRoute(route: string[]) {
    const location = useLocation()
    const currentRoute = location.pathname

    return route.includes(currentRoute)
}

export function getCurrentThemeMode() {
    return getLocalStorage('pow-crm-theme-mode');
}

export function toggelThemeMode(defaultMode = undefined){
    const currentThemeMode = getLocalStorage('pow-crm-theme-mode');
    if(defaultMode){
        setLocalStorage('pow-crm-theme-mode',defaultMode)
        document.body.removeAttribute('data-bs-theme');
    }else{
        let mode = '';
        if(currentThemeMode || currentThemeMode == "light"){
            setLocalStorage('pow-crm-theme-mode',"dark")
            document.body.setAttribute('data-bs-theme',"dark");
        }else{
            setLocalStorage('pow-crm-theme-mode',"light")
            document.body.removeAttribute('data-bs-theme');
        }
    }
}

export function flattenArray(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
    }, []);
}

export function sumOfValuesForKey(arr, key) {
    return arr.reduce((sum, obj) => {
        return sum + parseFloat(obj[key]);
    }, 0);
}

export function calcTotalETFGainsOthers(records) {
    if(records.finalDataHoldingValuationCurrent && records.finalDataHoldingValuationPrevious && records.finalDataTransactionReport){
        const liquidBeesTransactions = records.finalDataTransactionReport.filter((rec) => !rec.scrip_code.includes('LIQUIDBEES'))
        const liquidBeesHoldingValuationCurrent = records.finalDataHoldingValuationCurrent.filter((rec) => !rec.isin.includes('INF732E01037'))
        const liquidBeesHoldingValuationPrevious = records.finalDataHoldingValuationPrevious.filter((rec) => !rec.isin.includes('INF732E01037'))
        let portfolioValueCurrent = 0, portfolioValuePrevious = 0, buyValueTotal = 0, sellValueTotal = 0;
        if(liquidBeesHoldingValuationCurrent && liquidBeesHoldingValuationCurrent.length > 0){
            portfolioValueCurrent = sumOfValuesForKey(liquidBeesHoldingValuationCurrent,'valuation')
        }
        if(liquidBeesHoldingValuationCurrent && liquidBeesHoldingValuationCurrent.length > 0){
            portfolioValuePrevious = sumOfValuesForKey(liquidBeesHoldingValuationPrevious,'valuation')
        }
        if(liquidBeesTransactions && liquidBeesTransactions.length > 0){
            buyValueTotal = sumOfValuesForKey(liquidBeesTransactions,'buy_value')
        }
        if(liquidBeesTransactions && liquidBeesTransactions.length > 0){
            sellValueTotal = sumOfValuesForKey(liquidBeesTransactions,'sell_value')
        }
        return portfolioValueCurrent-portfolioValuePrevious-buyValueTotal+sellValueTotal
    }
    return 0
}
export function calcTotalETFGainsLiquid(records) {
    if(records.finalDataHoldingValuationCurrent && records.finalDataHoldingValuationPrevious && records.finalDataTransactionReport){
        const liquidBeesTransactions = records.finalDataTransactionReport.filter((rec) => rec.scrip_code.includes('LIQUIDBEES'))
        const liquidBeesHoldingValuationCurrent = records.finalDataHoldingValuationCurrent.filter((rec) => rec.isin.includes('INF732E01037'))
        const liquidBeesHoldingValuationPrevious = records.finalDataHoldingValuationPrevious.filter((rec) => rec.isin.includes('INF732E01037'))
        let portfolioValueCurrent = 0, portfolioValuePrevious = 0, buyValueTotal = 0, sellValueTotal = 0;
        if(liquidBeesHoldingValuationCurrent && liquidBeesHoldingValuationCurrent.length > 0){
            portfolioValueCurrent = parseFloat(sumOfValuesForKey(liquidBeesHoldingValuationCurrent,'valuation'))
        }
        if(liquidBeesHoldingValuationCurrent && liquidBeesHoldingValuationCurrent.length > 0){
            portfolioValuePrevious = parseFloat(sumOfValuesForKey(liquidBeesHoldingValuationPrevious,'valuation'))
        }
        if(liquidBeesTransactions && liquidBeesTransactions.length > 0){
            buyValueTotal = parseFloat(sumOfValuesForKey(liquidBeesTransactions,'buy_value'))
        }
        if(liquidBeesTransactions && liquidBeesTransactions.length > 0){
            sellValueTotal = parseFloat(sumOfValuesForKey(liquidBeesTransactions,'sell_value'))
        }
        return (portfolioValueCurrent-portfolioValuePrevious-buyValueTotal+sellValueTotal)/0.9
    }
    return 0
}

export function calcTotalETFGainsOthersDB(records,clientBrokerDetails) {
    if("ETF_TRANSACTION_REPORT" in records && "ETF_HOLDING_VALUATION" in records && "ETF_HOLDING_VALUATIONPrevious" in records){
        const liquidBeesTransactions = records.ETF_TRANSACTION_REPORT.filter((rec) => !rec.scripCode.includes('LIQUIDBEES') && !rec.scripCode.includes('LIQUID BEES'))
        const liquidBeesHoldingValuationCurrent = records.ETF_HOLDING_VALUATION.filter((rec) => !rec.isin.includes('INF732E01037'))
        const liquidBeesHoldingValuationPrevious = records.ETF_HOLDING_VALUATIONPrevious.filter((rec) => !rec.isin.includes('INF732E01037'))
        let portfolioValueCurrent = 0, portfolioValuePrevious = 0, buyValueTotal = 0, sellValueTotal = 0;
        if(liquidBeesHoldingValuationCurrent && liquidBeesHoldingValuationCurrent.length > 0){
            portfolioValueCurrent = liquidBeesHoldingValuationCurrent[liquidBeesHoldingValuationCurrent.length-1]['valuation']
        }
        if(liquidBeesHoldingValuationPrevious && liquidBeesHoldingValuationPrevious.length > 0){
            portfolioValuePrevious = liquidBeesHoldingValuationPrevious[liquidBeesHoldingValuationPrevious.length-1]['valuation']
        }
        if(liquidBeesTransactions && liquidBeesTransactions.length > 0){
            buyValueTotal = sumOfValuesForKey(liquidBeesTransactions,'buyValue')
        }
        if(liquidBeesTransactions && liquidBeesTransactions.length > 0){
            sellValueTotal = sumOfValuesForKey(liquidBeesTransactions,'sellValue')
        }
        if("ETF_TRANSACTION_REPORT_Prev" in records && "ETF_HOLDING_VALUATION_Prev" in records && "ETF_HOLDING_VALUATIONPrevious_Prev" in records){
            const liquidBeesTransactionsPrev = records.ETF_TRANSACTION_REPORT_Prev.filter((rec) => !rec.scripCode.includes('LIQUIDBEES') && !rec.scripCode.includes('LIQUID BEES'))
            const liquidBeesHoldingValuationCurrentPrev = records.ETF_HOLDING_VALUATION_Prev.filter((rec) => !rec.isin.includes('INF732E01037'))
            const liquidBeesHoldingValuationPreviousPrev = records.ETF_HOLDING_VALUATIONPrevious_Prev.filter((rec) => !rec.isin.includes('INF732E01037'))
            let portfolioValueCurrentPrev = 0, portfolioValuePreviousPrev = 0, buyValueTotalPrev = 0, sellValueTotalPrev = 0;
            if(liquidBeesHoldingValuationCurrentPrev && liquidBeesHoldingValuationCurrentPrev.length > 0){
                portfolioValueCurrentPrev = parseFloat(liquidBeesHoldingValuationCurrentPrev[liquidBeesHoldingValuationCurrentPrev.length-1]['valuation'])
            }
            if(liquidBeesHoldingValuationPreviousPrev && liquidBeesHoldingValuationPreviousPrev.length > 0){
                portfolioValuePreviousPrev = parseFloat(liquidBeesHoldingValuationPreviousPrev[liquidBeesHoldingValuationPreviousPrev.length-1]['valuation'])
            }
            if(liquidBeesTransactionsPrev && liquidBeesTransactionsPrev.length > 0){
                buyValueTotalPrev = parseFloat(sumOfValuesForKey(liquidBeesTransactionsPrev,'buyValue'))
            }
            if(liquidBeesTransactions && liquidBeesTransactions.length > 0){
                sellValueTotalPrev = parseFloat(sumOfValuesForKey(liquidBeesTransactionsPrev,'sellValue'))
            }
            if((portfolioValuePreviousPrev+buyValueTotalPrev+sellValueTotalPrev) > portfolioValueCurrentPrev){
                portfolioValuePrevious = portfolioValuePreviousPrev+buyValueTotalPrev+sellValueTotalPrev
            }
        }
        if((portfolioValuePrevious+buyValueTotal+sellValueTotal) <= portfolioValueCurrent){
            portfolioValueCurrent = portfolioValuePrevious+buyValueTotal+sellValueTotal
        }
        return portfolioValueCurrent-portfolioValuePrevious-(buyValueTotal+sellValueTotal)
    }
    return 0
}
export function calcTotalETFGainsLiquidDB(records,clientBrokerDetails) {
    // console.log("records",records)
    if("ETF_TRANSACTION_REPORT" in records && "ETF_HOLDING_VALUATION" in records && "ETF_HOLDING_VALUATIONPrevious" in records){
        const liquidBeesTransactions = records.ETF_TRANSACTION_REPORT.filter((rec) => rec.scripCode.includes('LIQUIDBEES') || rec.scripCode.includes('LIQUID BEES'))
        const liquidBeesHoldingValuationCurrent = records.ETF_HOLDING_VALUATION.filter((rec) => rec.isin.includes('INF732E01037'))
        const liquidBeesHoldingValuationPrevious = records.ETF_HOLDING_VALUATIONPrevious.filter((rec) => rec.isin.includes('INF732E01037'))
        let portfolioValueCurrent = 0, portfolioValuePrevious = 0, buyValueTotal = 0, sellValueTotal = 0;
        if(liquidBeesHoldingValuationCurrent && liquidBeesHoldingValuationCurrent.length > 0){
            portfolioValueCurrent = parseFloat(liquidBeesHoldingValuationCurrent[liquidBeesHoldingValuationCurrent.length-1]['valuation'])
        }
        if(liquidBeesHoldingValuationPrevious && liquidBeesHoldingValuationPrevious.length > 0){
            portfolioValuePrevious = parseFloat(liquidBeesHoldingValuationPrevious[liquidBeesHoldingValuationPrevious.length-1]['valuation'])
        }
        if(liquidBeesTransactions && liquidBeesTransactions.length > 0){
            buyValueTotal = parseFloat(sumOfValuesForKey(liquidBeesTransactions,'buyValue'))
            sellValueTotal = parseFloat(sumOfValuesForKey(liquidBeesTransactions,'sellValue'))
        }
        if("ETF_TRANSACTION_REPORT_Prev" in records && "ETF_HOLDING_VALUATION_Prev" in records && "ETF_HOLDING_VALUATIONPrevious_Prev" in records){
            const liquidBeesTransactionsPrev = records.ETF_TRANSACTION_REPORT_Prev.filter((rec) => rec.scripCode.includes('LIQUIDBEES') || rec.scripCode.includes('LIQUID BEES'))
            const liquidBeesHoldingValuationCurrentPrev = records.ETF_HOLDING_VALUATION_Prev.filter((rec) => rec.isin.includes('INF732E01037'))
            const liquidBeesHoldingValuationPreviousPrev = records.ETF_HOLDING_VALUATIONPrevious_Prev.filter((rec) => rec.isin.includes('INF732E01037'))
            let portfolioValueCurrentPrev = 0, portfolioValuePreviousPrev = 0, buyValueTotalPrev = 0, sellValueTotalPrev = 0;
            if(liquidBeesHoldingValuationCurrentPrev && liquidBeesHoldingValuationCurrentPrev.length > 0){
                portfolioValueCurrentPrev = parseFloat(liquidBeesHoldingValuationCurrentPrev[liquidBeesHoldingValuationCurrentPrev.length-1]['valuation'])
            }
            if(liquidBeesHoldingValuationPreviousPrev && liquidBeesHoldingValuationPreviousPrev.length > 0){
                portfolioValuePreviousPrev = parseFloat(liquidBeesHoldingValuationPreviousPrev[liquidBeesHoldingValuationPreviousPrev.length-1]['valuation'])
            }
            if(liquidBeesTransactionsPrev && liquidBeesTransactionsPrev.length > 0){
                buyValueTotalPrev = parseFloat(sumOfValuesForKey(liquidBeesTransactionsPrev,'buyValue'))
                sellValueTotalPrev = parseFloat(sumOfValuesForKey(liquidBeesTransactionsPrev,'sellValue'))
            }
            if((portfolioValuePreviousPrev+(buyValueTotalPrev+sellValueTotalPrev)) > portfolioValueCurrentPrev){
                portfolioValuePrevious = portfolioValuePreviousPrev+(buyValueTotalPrev+sellValueTotalPrev)
            }
        }
        if((portfolioValuePrevious+(buyValueTotal+sellValueTotal)) > portfolioValueCurrent){
            portfolioValueCurrent = portfolioValuePrevious+(buyValueTotal+sellValueTotal)
        }
        let multiplier = 1
        console.log("clientBrokerDetails.broker.code",clientBrokerDetails.broker.code)
        if(clientBrokerDetails && clientBrokerDetails.broker.code.includes("iifl")){
            multiplier = 1000
        }
        console.log("multiplier",multiplier)
        return (portfolioValueCurrent-portfolioValuePrevious-(buyValueTotal+sellValueTotal))*multiplier/0.9
    }
    return 0
}


export function calculatePercentage(value, total) {
    if (total === 0) {
        throw new Error("Total cannot be zero");
    }
    const percentage = (value / total) * 100;

    return percentage;
}

toggelThemeMode("light")