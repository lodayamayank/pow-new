import { ApplicationLayout } from "@/components";
import { Client } from "@/pages/Clients/core/_models";
import { getClientAUMRecords, getClientBrokerRecords, getClientProfitsRecords, getRecords as getClientsRecords } from "@/pages/Clients/core/_requests";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import moment, { Moment } from "moment";
import { stringifyRequestQuery } from "@/utils/libs/crud-helper";
import { getAllTradeData } from "../core/_requests";
import { calcTotalETFGainsLiquidDB, calcTotalETFGainsOthersDB, calculatePercentage, sumOfValuesForKey } from "@/utils";
import { LedgerDBTable } from "@/pages/TradeData/Ledger/LedgerDBTable";
import { FnODBTable } from "@/pages/TradeData/FnOProfits/FnODBTable";
import { PortfolioValueDBTable } from "@/pages/TradeData/PortfolioValue/PortfolioValueDBTable";
import { ETFDBTable } from "@/pages/TradeData/ETFGains/ETFDBTable";
import Select from 'react-select'
import * as XLSX from 'xlsx';

type Props = {
    children?: React.ReactNode
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Landing(props: Props) {
    const { children } = props
    const [clients, setClients] = useState<Client[]>([])
    const [clientId, setClientId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloadingReport, setIsDownloadingReport] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"))
    const [isGenerateReport, setIsGenerateReport] = useState(false)
    const [firstAUMDate, setFirstAUMDate] = useState<string>(moment().subtract(1, "year").format("YYYY-MM-DD"))
    const [selectedDateMoment, setSelectedDateMoment] = useState(moment())
    const [selectedClient, setSelectedClient] = useState(null)
    const [selectedClientCode, setSelectedClientCode] = useState(null)
    const [currentBrokerTab, setCurrentBrokerTab] = useState<string>("angle")
    const [currentTab, setCurrentTab] = useState<string>("report")
    const [months, setMonths] = useState([])
    const [allTradeData, setAllTradeData] = useState({})
    const [allTradeDataGrouped, setAllTradeDataGrouped] = useState({})
    const [allTradeDataGroupedKeys, setAllTradeDataGroupedKeys] = useState({})
    const [latestTradeDataGrouped, setLatestTradeDataGrouped] = useState({})
    const [currentAllTradeDataTab, setCurrentAllTradeDataTab] = useState<string>()
    const [currentAllTradeDataGroupedTab, setCurrentAllTradeDataGroupedTab] = useState<string>()
    const [currentClientCodeTab, setCurrentClientCodeTab] = useState<string>(null)

    async function loadClients() {
        try {
            const response = await getClientsRecords()
            const recordsList = response?.data || [];
            setClients(recordsList)
        } catch (error) {
            const err = error as AxiosError
            return err
        }
    }

    function closestPreviousFriday(date) {
        const closest = new Date(date);
        const dayOfWeek = closest.getDay();
        if (dayOfWeek === 6) {
            return closest;
        }
        // const daysToSubtract = dayOfWeek === 4 ? 0 : dayOfWeek + 1;
        const daysToSubtract = dayOfWeek === 5 ? 0 : dayOfWeek + 1;
        closest.setDate(closest.getDate() - daysToSubtract);
        return closest;
    }

    function getFinancialYearsLabelFromDate(inputDate) {
        const startDate = moment(inputDate, 'YYYY-MM-DD');
        const startYear = startDate.month() < 3 ? startDate.clone().subtract(1, 'year').startOf('year') : startDate.clone().startOf('year');
        const currentFinancialYear = `${startYear.format('YYYY')}-${startYear.clone().add(1, 'year').format('YY')}`;

        return currentFinancialYear;
    }

    function getLastFridayOfMonth(year, month) {
        const lastDayOfMonth = moment({ year, month }).endOf('month');
        // let lastFriday = lastDayOfMonth.clone().endOf('week').day('Friday');
        // switching to saturday as the weekend
        let lastFriday = lastDayOfMonth.clone().endOf('week').day('Saturday');
        if (lastFriday.month() != month) {
            lastFriday = lastDayOfMonth.clone().endOf('week').subtract(1, 'week').day('Saturday');
        }
        return lastFriday;
    }

    function getLastSaturdayOfMonth(dateString) {
        const date = moment(dateString, "YYYY-MM-DD");

        const lastDayOfMonth = date.endOf('month');

        let lastSaturday = lastDayOfMonth.clone().endOf('week').day('Saturday');
        if (lastSaturday.month() != date.month()) {
            lastSaturday = lastDayOfMonth.clone().endOf('week').subtract(1, 'week').day('Saturday');
        }

        return lastSaturday;
    }

    function getAllLastFridaysBetween(startDate, endDate) {
        const startMoment = moment(startDate, 'YYYY-MM-DD');
        const endMoment = moment(endDate, 'YYYY-MM-DD').endOf("month");

        const lastFridays = [];

        // Iterate over each month between start and end dates
        let currentMonthStart = moment(startMoment).startOf('month');
        while (currentMonthStart.isSameOrBefore(endMoment)) {
            const year = currentMonthStart.year();
            const month = currentMonthStart.month();

            // Find the last Friday of the current month
            const lastFridayOfMonth = getLastFridayOfMonth(year, month);
            // Add the last Friday to the list if it falls within the range 
            if (lastFridayOfMonth.isBetween(startMoment, endMoment, 'day', '(]')) {
                lastFridays.push(lastFridayOfMonth.format('YYYY-MM-DD'));
            }

            // Move to the next month
            currentMonthStart.add(1, 'month').startOf('month');
        }

        return lastFridays;
    }

    function getNextMondayFromDate(date) {
        // Parse the input date using Moment.js
        const inputDate = moment(date, 'YYYY-MM-DD');

        // Find the next Monday using Moment.js methods
        // const nextMonday = inputDate.clone().startOf('isoWeek').add(7, 'days');
        const nextMonday = inputDate.clone().startOf('week').add(7, 'days');

        return nextMonday.format('YYYY-MM-DD');
    }


    function getFinancialYearMonths(startDate, endDate) {
        const months = [];
        const financialYears = new Set();

        const startDateMoment = moment(startDate, "YYYY-MM-DD").utcOffset("+5:30")
        const endDateMoment = moment(endDate, "YYYY-MM-DD").endOf('month').utcOffset("+5:30")

        const lastFridays = getAllLastFridaysBetween(startDate, endDate);
        let firstNextMonday = getNextMondayFromDate(lastFridays[0]);
        lastFridays.forEach((lastFriday, indx) => {
            if (indx == 0) {
                let formattedStart = moment(startDate).format("YYYY-MM-DD")
                if (moment(startDate).month() == 3) {
                    startDate = moment(startDate).startOf('month').format("YYYY-MM-DD")
                    formattedStart = moment(startDate).startOf('month').format("YYYY-MM-DD")
                }
                let formattedEnd = moment(lastFriday).format("YYYY-MM-DD")
                if (moment(lastFriday).month() == 2) {
                    lastFriday = moment(lastFriday).endOf('month').format("YYYY-MM-DD")
                    formattedEnd = moment(lastFriday).endOf('month').format("YYYY-MM-DD")
                }
                months.push({
                    key: `${formattedStart}_to_${formattedEnd}`,
                    start: startDate,
                    end: lastFriday,
                    formattedStart,
                    formattedEnd
                })
            } else {
                let formattedStart = moment(firstNextMonday).format("YYYY-MM-DD")
                if (moment(firstNextMonday).month() == 3 && moment(lastFriday).month() != 4) {
                    firstNextMonday = moment(firstNextMonday).startOf('month').format("YYYY-MM-DD")
                    formattedStart = moment(firstNextMonday).startOf('month').format("YYYY-MM-DD")
                }
                let formattedEnd = moment(lastFriday).format("YYYY-MM-DD")
                if (moment(lastFriday).month() == 2) {
                    lastFriday = moment(lastFriday).endOf('month').format("YYYY-MM-DD")
                    formattedEnd = moment(lastFriday).endOf('month').format("YYYY-MM-DD")
                }
                months.push({
                    key: `${formattedStart}_to_${formattedEnd}`,
                    start: firstNextMonday,
                    end: lastFriday,
                    formattedStart,
                    formattedEnd
                })
            }
            firstNextMonday = getNextMondayFromDate(lastFriday);
        })
        return months
    }

    function groupObjectsByFinancialYears(objects) {
        // Define a function to get the financial year from a given date
        function getFinancialYearFromDate(date) {
            const inputDate = moment(date, 'YYYY-MM-DD');
            const startYear = inputDate.month() < 3 ? inputDate.clone().subtract(1, 'year').startOf('year') : inputDate.clone().startOf('year');
            return Number(startYear.format('YYYY') + "" + startYear.clone().add(1, 'year').format('YY'));
        }

        // Create an object to store grouped objects by financial years
        const groupedObjects = {};

        // Iterate over each key-value pair in the input object
        Object.entries(objects).forEach(([dateRange, obj]) => {
            const financialYear = getFinancialYearFromDate(obj.date);

            // If the financial year key doesn't exist in the grouped objects, create it
            if (!groupedObjects[financialYear]) {
                groupedObjects[financialYear] = {};
            }

            // Add the object to the corresponding financial year group using the date range as key
            groupedObjects[financialYear][dateRange] = obj;
        });

        return groupedObjects;
    }

    async function loadTradeData() {
        setAllTradeData({})
        await Promise.all(clientId.map(async (clientIdObj) => {
            const clientDetails = clients.find((client) => client.uuid == clientIdObj.value);
            const clientBrokersResponse = await getClientBrokerRecords(clientIdObj.value);
            const clientBrokers = clientBrokersResponse?.data || [];
            await Promise.all(clientBrokers.map(async (clientBroker) => {
                setIsLoading(true)
                // if(clientBroker.broker.code.includes(currentBrokerTab)){
                const qry = {
                    "filter": {
                        "start_date": selectedDate,
                        "client_broker_id": clientBroker.broker.id
                    },
                    "items_per_page": 100000000000
                }
                const responseAUM = await getClientAUMRecords(clientIdObj.value, stringifyRequestQuery(qry))
                if ("data" in responseAUM) {
                    const firstAum = responseAUM["data"][responseAUM["data"].length - 1]
                    setFirstAUMDate(moment(firstAum.startDate).format("YYYY-MM-DD"))
                    let monthRanges = getFinancialYearMonths(moment(firstAum.startDate).format("YYYY-MM-DD"), selectedDate);
                    setMonths(monthRanges)
                    const reqData = {
                        "generate_html_report": isGenerateReport ? "monthly" : "none",
                        "dates": monthRanges,
                        "client_id": clientIdObj.value,
                        "client_broker_id": clientBroker.uuid
                    }
                    setSelectedClientCode(clientBroker.clientCode)
                    try {
                        const allTradeDataResponse = await getAllTradeData(reqData)
                        if (allTradeDataResponse.status == 201) {
                            let dataAll = allTradeDataResponse.data;
                            // setAllTradeData(dataAll)
                            const allTradeDataCp = allTradeData
                            allTradeDataCp[clientBroker.clientCode] = { "clientDetails": clientDetails, "tradeData": dataAll }
                            setAllTradeData(allTradeDataCp)
                            const grouped = groupObjectsByFinancialYears(dataAll)
                            let groupedObjectKeys = Object.keys(grouped)
                            const allTradeDataGroupedKeysCp = allTradeDataGroupedKeys
                            allTradeDataGroupedKeysCp[clientBroker.clientCode] = groupedObjectKeys
                            setAllTradeDataGroupedKeys(allTradeDataGroupedKeysCp)
                            const allTradeDataGroupedCp = allTradeDataGrouped
                            allTradeDataGroupedCp[clientBroker.clientCode] = grouped
                            setAllTradeDataGrouped(allTradeDataGroupedCp)
                            const latestTradeDataGroupedCp = latestTradeDataGrouped
                            latestTradeDataGroupedCp[clientBroker.clientCode] = grouped[groupedObjectKeys[groupedObjectKeys.length - 1]]
                            setLatestTradeDataGrouped(latestTradeDataGroupedCp)
                        }
                        // setIsLoading(false)
                    } catch (e) {
                        console.log("angel error", e)
                        setIsLoading(false)
                    }
                }

                // }
            }))
        }))
        setIsLoading(false)

    }

    function getFinalLedgerBalance(clientCode) {
        if (allTradeData && clientCode in allTradeData) {
            const dataKeys = Object.keys(allTradeData[clientCode]["tradeData"])
            if (dataKeys.length > 0) {
                // console.log("dataKeys",dataKeys)
                const lastKeyValue = allTradeData[clientCode]["tradeData"][dataKeys[dataKeys.length - 1]]
                return lastKeyValue["LEDGER"].length > 0 ? Number(lastKeyValue["LEDGER"][lastKeyValue["LEDGER"].length - 1]["balance"]) : 0
            }
        }
        return 0
    }
    // 
    function getFinalPortfolioValue(clientCode) {
        let totalPortfolioValue = 0;
        if (allTradeData && clientCode in allTradeData) {
            const dataKeys = Object.keys(allTradeData[clientCode]["tradeData"])
            if (dataKeys.length > 0) {
                const lastKeyPORTFOLIO_VALUE = allTradeData[clientCode]["tradeData"][dataKeys[dataKeys.length - 1]]["PORTFOLIO_VALUE"]
                if (lastKeyPORTFOLIO_VALUE.length > 0) {
                    const lastKeyPORTFOLIO_VALUE_EntryDate = lastKeyPORTFOLIO_VALUE[lastKeyPORTFOLIO_VALUE.length - 1]["entryDate"]
                    lastKeyPORTFOLIO_VALUE.forEach(ele => {
                        if (ele.entryDate == lastKeyPORTFOLIO_VALUE_EntryDate) {
                            totalPortfolioValue += ele.holdingValue
                        }
                    })
                }
            }
        }
        return totalPortfolioValue
    }


    function yearlyTotals(clientCode, financialYearKey) {
        let totalNetProfit = 0
        let totalROI = 0
        const financialYearTradeData = clientCode in allTradeDataGrouped && financialYearKey in allTradeDataGrouped[clientCode] ? allTradeDataGrouped[clientCode][financialYearKey] : null
        if (financialYearTradeData) {
            const financialYearTradeDataKeys = Object.keys(financialYearTradeData);
            financialYearTradeDataKeys.forEach(element => {
                const monthData = allTradeData[clientCode]["tradeData"][element]
                const aum = "aum" in monthData && monthData["aum"].length > 0 ? Number(monthData["aum"][0]["amount"]) : 0
                const adjustments = "adjustments" in monthData && monthData["adjustments"].length > 0 ? sumOfValuesForKey(monthData["adjustments"], "amount") : 0
                let charges = 0, totalETFGains = 0, totalFnOPNL = 0
                if ("LEDGER" in monthData && monthData["LEDGER"].length > 0) {
                    const filteredLedger = monthData["LEDGER"].filter((item) => item.category.includes("charge"))
                    charges = sumOfValuesForKey(filteredLedger, "debit")
                }
                if ("FNO_PROFITS" in monthData && monthData["FNO_PROFITS"].length > 0) {
                    const grossPNL = sumOfValuesForKey(monthData["FNO_PROFITS"], "netPNL")
                    // const totalCharges = sumOfValuesForKey(monthData["FNO_PROFITS"],"charges")
                    // totalFnOPNL = grossPNL-totalCharges
                    totalFnOPNL = grossPNL
                }
                if ("ETF_TRANSACTION_REPORT" in monthData && "ETF_HOLDING_VALUATION" in monthData && "ETF_HOLDING_VALUATIONPrevious" in monthData) {
                    const totalLiquidBeesGains = calcTotalETFGainsLiquidDB(monthData);
                    const totalOtherETFGains = calcTotalETFGainsOthersDB(monthData);
                    // @ts-ignore
                    totalETFGains = parseFloat(totalLiquidBeesGains) + parseFloat(totalOtherETFGains)
                }
                let result = ((totalFnOPNL + totalETFGains) - charges) + adjustments //Number((result).toFixed(2)).toLocaleString('en-US')
                const resultsPercentage = calculatePercentage(result, aum)
                totalNetProfit += result
                totalROI += resultsPercentage
            });
        }
        return { totalNetProfit, totalROI }
    }


    useEffect(() => {
        loadClients()
    }, [])

    const totalNetProfit = {}
    const totalROI = {}

    if (allTradeData && Object.keys(allTradeData).length > 0) {
        Object.keys(allTradeData).map((code) => {
            totalNetProfit[code] = 0
            totalROI[code] = 0
        })
    }

    console.log("allTradeDataGroupedKeys", allTradeDataGroupedKeys)


    // Export all clients' monthly reports into a single Excel workbook
    const exportAllMonthlyReportsToExcel = async () => {
        setIsDownloadingReport(true)
        try {
            const clientCodes = allTradeData ? Object.keys(allTradeData) : []
            if (!clientCodes || clientCodes.length === 0) {
                alert("No reports generated")
                setIsDownloadingReport(false)
                return
            }

            const wb = XLSX.utils.book_new();

            for (const clientCode of clientCodes) {
                try {
                    // 1) Build Summary sheet from months & aggregated values
                    const summaryHeader = ["Month", "AUM", "Net Profit", "ROI (%)", "FnO PNL", "ETF Gains", "Charges", "Adjustments"];
                    const summaryRows: any[] = [];
                    if (months && months.length > 0) {
                        months.forEach((month) => {
                            const dateKey = `${month.formattedStart}_to_${month.formattedEnd}`;
                            const monthData = allTradeData[clientCode]?.["tradeData"]?.[dateKey] || null;
                            if (monthData) {
                                const aum = "aum" in monthData && monthData["aum"].length > 0 ? Number(monthData["aum"][0]["amount"]) : 0;
                                const adjustments = "adjustments" in monthData && monthData["adjustments"].length > 0 ? sumOfValuesForKey(monthData["adjustments"], "amount") : 0;
                                let charges = 0, totalETFGains = 0, totalFnOPNL = 0;
                                if ("LEDGER" in monthData && monthData["LEDGER"].length > 0) {
                                    const filteredLedger = monthData["LEDGER"].filter((item) => item.category.includes("charge"))
                                    charges = sumOfValuesForKey(filteredLedger, "debit")
                                }
                                if ("FNO_PROFITS" in monthData && monthData["FNO_PROFITS"].length > 0) {
                                    const grossPNL = sumOfValuesForKey(monthData["FNO_PROFITS"], "grossPNL")
                                    const totalCharges = sumOfValuesForKey(monthData["FNO_PROFITS"], "charges")
                                    totalFnOPNL = grossPNL - totalCharges
                                }
                                if ("ETF_TRANSACTION_REPORT" in monthData && "ETF_HOLDING_VALUATION" in monthData && "ETF_HOLDING_VALUATIONPrevious" in monthData) {
                                    const totalLiquidBeesGains = calcTotalETFGainsLiquidDB(monthData);
                                    const totalOtherETFGains = calcTotalETFGainsOthersDB(monthData);
                                    // @ts-ignore
                                    totalETFGains = parseFloat(totalLiquidBeesGains) + parseFloat(totalOtherETFGains)
                                }
                                const result = ((totalFnOPNL + totalETFGains) - charges) + adjustments;
                                const resultsPercentage = calculatePercentage(result, aum);
                                summaryRows.push([moment(month.formattedEnd).format("MMM YYYY"), aum, Number(result.toFixed(2)), Number(resultsPercentage.toFixed(2)), Number(totalFnOPNL.toFixed(2)), Number(totalETFGains.toFixed(2)), Number(charges.toFixed(2)), Number(adjustments.toFixed(2))])
                            }
                        })
                    }
                    const summarySheet = XLSX.utils.aoa_to_sheet([summaryHeader, ...summaryRows]);
                    const summarySheetName = (`${clientCode}_Summary`).slice(0, 31);
                    XLSX.utils.book_append_sheet(wb, summarySheet, summarySheetName);

                    // 2) For each month, append "All Data" sheets similar to existing all-data format
                    const allTradeDataDateKeyTradeData = allTradeData[clientCode]?.['tradeData'] || {}
                    const allTradeDataKeys = Object.keys(allTradeDataDateKeyTradeData)
                    if (allTradeDataKeys.length > 0) {
                        for (const dateKeys of allTradeDataKeys) {
                            const ws = XLSX.utils.aoa_to_sheet([]);
                            let currentRow = 0;
                            const weekData = allTradeDataDateKeyTradeData[dateKeys];
                            Object.keys(weekData).forEach((key) => {
                                if (key !== "date" && key !== "datekey" && key !== "aum" && key !== "profits") {
                                    const data = weekData[key];
                                    if (Array.isArray(data) && data.length > 0) {
                                        // blank row separator
                                        currentRow++;
                                        XLSX.utils.sheet_add_aoa(ws, [[key]], { origin: -1 + currentRow });
                                        currentRow++;
                                        let headers = Object.keys(data[0] || {});
                                        headers = headers.filter(item => item !== "_id" && item !== "clientId" && item !== "clientBrokerAccountId" && item !== "brokerId" && item !== "scrappedData");
                                        XLSX.utils.sheet_add_aoa(ws, [headers], { origin: -1 + currentRow });
                                        currentRow++;
                                        data.forEach(obj => {
                                            const rowData = headers.map(header => obj[header]);
                                            XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: -1 + currentRow });
                                            currentRow++;
                                        });
                                    }
                                }
                            });
                            const dateKeySplit = dateKeys.split("_to_")
                            const sheetName = (`${clientCode}_${dateKeySplit[1] || dateKeys}`).slice(0, 31);
                            XLSX.utils.book_append_sheet(wb, ws, sheetName);
                        }
                    }
                } catch (clientErr) {
                    console.log("error exporting client", clientCode, clientErr);
                    // continue with next client
                }
            }

            XLSX.writeFile(wb, `Monthly Reports All Clients ${selectedDate}.xlsx`);
        } catch (e) {
            console.log("download error", e)
            alert("Error while generating Excel")
        } finally {
            setIsDownloadingReport(false)
        }
    }

    return (
        <>
            <ApplicationLayout>
                <main>
                    <div className="page-body">
                        <div className="container-xl">
                            <div className=" mx-auto">
                                <div className="flex flex-col">
                                    <div className="-m-1.5 overflow-x-auto">
                                        <div className="p-1 min-w-full inline-block align-middle">
                                            <div className="col-12">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h3 className="card-title">Client Monthly Report</h3>
                                                        <div className="card-actions">
                                                            <button className="btn me-2" disabled={isDownloadingReport} onClick={exportAllMonthlyReportsToExcel}>
                                                                {isDownloadingReport ? 'Downloading...' : 'Download All'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    -                                                <div className="card-body border-0 py-3">
                                                        +                                                <div className="card-body border-0 py-3">
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    {clients && clients.length > 0 && (
                                                                        <Select
                                                                            options={clients.map(({ uuid, name }) => ({ "value": uuid, "label": name }))}
                                                                            isMulti={true}
                                                                            value={clientId}
                                                                            onChange={(selectedOptions) => {
                                                                                setClientId(selectedOptions)
                                                                            }}
                                                                            placeholder="Select..."
                                                                            isSearchable
                                                                        />
                                                                    )}
                                                                </div>
                                                                <div className="col-md-2">
                                                                    <input type="date" className="form-control" placeholder="YYYY-MM-DD"
                                                                        defaultValue={selectedDate}
                                                                        onChange={(e) => setSelectedDate(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <div className="d-flex">
                                                                        <label className="form-check me-2 pt-2">
                                                                            <input className="form-check-input"
                                                                                defaultChecked={isGenerateReport}
                                                                                type="checkbox" onChange={(e) => {
                                                                                    if (e.target.checked) {
                                                                                        setIsGenerateReport(true)
                                                                                    } else {
                                                                                        setIsGenerateReport(false)
                                                                                    }
                                                                                }} />
                                                                            <span className="form-check-label">
                                                                                Generate HTML Report
                                                                            </span>
                                                                        </label>
                                                                        <button type="button" className="btn btn-primary"
                                                                            disabled={isLoading}
                                                                            onClick={() => loadTradeData()}
                                                                        >{isLoading ? 'Loading...' : 'Submit'}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-body p-0 min-vh-100">
                                                            <div className="card">
                                                                <div className="card-header">
                                                                    <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                                                                        {allTradeData && Object.keys(allTradeData).map((clientCode) => (
                                                                            <li
                                                                                className="nav-item cursor-pointer"
                                                                                role="presentation"
                                                                                onClick={() => setCurrentClientCodeTab(clientCode)}
                                                                            >
                                                                                <span className={`nav-link ${currentClientCodeTab == clientCode ? 'active' : ''}`} role="tab">{clientCode}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                {allTradeData && Object.keys(allTradeData).map((clientCode) => (
                                                                    <div className={`${currentClientCodeTab == clientCode ? '' : 'd-none'}`}>
                                                                        <div className="card-header">
                                                                            <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                                                                                <li
                                                                                    className="nav-item cursor-pointer"
                                                                                    role="presentation"
                                                                                    onClick={() => setCurrentTab(clientCode + '_report')}
                                                                                >
                                                                                    <span className={`nav-link ${currentTab == clientCode + "_report" ? 'active' : ''}`} role="tab">Report</span>
                                                                                </li>
                                                                                <li
                                                                                    className="nav-item cursor-pointer"
                                                                                    role="presentation"
                                                                                    onClick={() => setCurrentTab(clientCode + '_alldata')}
                                                                                >
                                                                                    <span className={`nav-link ${currentTab == clientCode + "_alldata" ? 'active' : ''}`} role="tab">All Data</span>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                        <div className={`card-body p-0 ${currentTab == clientCode + "_report" ? '' : 'd-none'}`}>
                                                                            <div className="card-body">
                                                                                <div className="row">
                                                                                    <div className="col-md-6">
                                                                                        <h1 className="h1">{clientCode in allTradeData ? allTradeData[clientCode]["clientDetails"]["name"] : ''} - {clientCode}</h1>
                                                                                    </div>
                                                                                    <div className="col-md-6 text-end">
                                                                                        {isGenerateReport && Object.keys(allTradeData[clientCode]).length > 0 && (<a target="_blank" href={`${process.env.DO_SPACES_BUCKET_CDN_URL}reports/monthly/${clientCode}/${getLastSaturdayOfMonth(selectedDate).format("YYYY-MM-DD")}.html`} className="btn btn-primary me-2">HTML Report</a>)}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <div className="col-md-12 col-lg-6">
                                                                                        <div className="card">
                                                                                            <div className="card-header">
                                                                                                <h3 className="card-title">Financial Snapshot ({moment(selectedDate).month() < 3 ? moment(selectedDate).subtract(1, 'year').format("YYYY") : moment(selectedDate).format("YYYY")}-{moment(selectedDate).month() < 3 ? moment(selectedDate).format("YYYY").substring(2, 4) : moment(selectedDate).add(1, 'year').format("YYYY").substring(2, 4)})</h3>
                                                                                            </div>
                                                                                            <table className="table card-table table-vcenter">
                                                                                                <thead>
                                                                                                    <tr>
                                                                                                        <th>{selectedDate ? getFinancialYearsLabelFromDate(selectedDate) : ''}</th>
                                                                                                        <th>AUM</th>
                                                                                                        <th>Net Profit</th>
                                                                                                        <th>ROI</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    {
                                                                                                        allTradeData && clientCode in allTradeData && latestTradeDataGrouped && clientCode in latestTradeDataGrouped && months && months.map((month) => {
                                                                                                            const dateKey = `${month['formattedStart']}_to_${month['formattedEnd']}`
                                                                                                            if (dateKey in latestTradeDataGrouped[clientCode]) {
                                                                                                                const monthData = allTradeData[clientCode]["tradeData"][dateKey]
                                                                                                                const aum = "aum" in monthData && monthData["aum"].length > 0 ? Number(monthData["aum"][0]["amount"]) : 0
                                                                                                                const adjustments = "adjustments" in monthData && monthData["adjustments"].length > 0 ? sumOfValuesForKey(monthData["adjustments"], "amount") : 0
                                                                                                                let charges = 0, totalETFGains = 0, totalFnOPNL = 0
                                                                                                                if ("LEDGER" in monthData && monthData["LEDGER"].length > 0) {
                                                                                                                    const filteredLedger = monthData["LEDGER"].filter((item) => item.category.includes("charge"))
                                                                                                                    charges = sumOfValuesForKey(filteredLedger, "debit")
                                                                                                                }
                                                                                                                if ("FNO_PROFITS" in monthData && monthData["FNO_PROFITS"].length > 0) {
                                                                                                                    const grossPNL = sumOfValuesForKey(monthData["FNO_PROFITS"], "grossPNL")
                                                                                                                    const totalCharges = sumOfValuesForKey(monthData["FNO_PROFITS"], "charges")
                                                                                                                    totalFnOPNL = grossPNL - totalCharges
                                                                                                                    // totalFnOPNL = grossPNL
                                                                                                                }
                                                                                                                if ("ETF_TRANSACTION_REPORT" in monthData && "ETF_HOLDING_VALUATION" in monthData && "ETF_HOLDING_VALUATIONPrevious" in monthData) {
                                                                                                                    const totalLiquidBeesGains = calcTotalETFGainsLiquidDB(monthData);
                                                                                                                    const totalOtherETFGains = calcTotalETFGainsOthersDB(monthData);
                                                                                                                    // @ts-ignore
                                                                                                                    totalETFGains = parseFloat(totalLiquidBeesGains) + parseFloat(totalOtherETFGains)
                                                                                                                }
                                                                                                                let result = ((totalFnOPNL + totalETFGains) - charges) + adjustments //Number((result).toFixed(2)).toLocaleString('en-US')
                                                                                                                const resultsPercentage = calculatePercentage(result, aum)
                                                                                                                totalNetProfit[clientCode] += result
                                                                                                                totalROI[clientCode] += resultsPercentage
                                                                                                                // const result = "N/A"
                                                                                                                return (
                                                                                                                    <tr>
                                                                                                                        <td>{moment(month.end, "YYYY-MM-DD").format("MMM")}</td>
                                                                                                                        <td>{Number(aum).toLocaleString("en-US")}</td>
                                                                                                                        <td>{Number((result).toFixed(2)).toLocaleString('en-US')} <br />
                                                                                                                            <span className="fs-6 text-secondary">FnO PNL: {totalFnOPNL.toFixed(2)}<br />
                                                                                                                                Total ETF Gains: {totalETFGains.toFixed(2)}<br />
                                                                                                                                Charges: {charges.toFixed(2)}<br />
                                                                                                                                Adjustments: {adjustments.toFixed(2)}</span>
                                                                                                                        </td>
                                                                                                                        <td>{resultsPercentage.toFixed(2)}%</td>
                                                                                                                    </tr>
                                                                                                                )
                                                                                                            }
                                                                                                        })}
                                                                                                </tbody>
                                                                                                <tfoot className="bg-gray-800">
                                                                                                    <tr>
                                                                                                        <th>Total</th>
                                                                                                        <th>{Number((totalNetProfit[clientCode] / (totalROI[clientCode] / 100)).toFixed(2)).toLocaleString("us-IN")}</th>
                                                                                                        <th>{Number(totalNetProfit[clientCode].toFixed(2)).toLocaleString("us-IN")}</th>
                                                                                                        <th>{totalROI[clientCode].toFixed(2)}%</th>
                                                                                                    </tr>
                                                                                                </tfoot>
                                                                                            </table>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-12 col-lg-3">
                                                                                        <div className="row row-cards">
                                                                                            {allTradeDataGroupedKeys && clientCode in allTradeDataGroupedKeys && allTradeDataGroupedKeys[clientCode].map((allGroupedKey, indx) => {
                                                                                                if (indx != allTradeDataGroupedKeys[clientCode].length - 1) {
                                                                                                    return (
                                                                                                        <div className="card card-sm">
                                                                                                            <div className="card-status-top bg-green"></div>
                                                                                                            <div className="card-body">
                                                                                                                <h3 className="card-title">{String(allGroupedKey).substring(0, 4)}-{String(allGroupedKey).substring(4, 6)}</h3>
                                                                                                                <div className="divide-y-2 mt-4">
                                                                                                                    <div>
                                                                                                                        Net Profit: {Number(yearlyTotals(clientCode, allGroupedKey)["totalNetProfit"].toFixed(2)).toLocaleString("en-US")}
                                                                                                                    </div>
                                                                                                                    <div>
                                                                                                                        ROI: {Number(yearlyTotals(clientCode, allGroupedKey)["totalROI"].toFixed(2)).toLocaleString("en-US")}%
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                }
                                                                                            })}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-12 col-lg-3 ps-3">
                                                                                        <div className="row row-cards">
                                                                                            <div className="card bg-gray-500">
                                                                                                <div className="card-body">
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <div className="subheader">Ledger Balance</div>
                                                                                                    </div>
                                                                                                    <div className="h1 mb-3">{getFinalLedgerBalance(clientCode).toLocaleString("en-US")}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="card bg-gray-500">
                                                                                                <div className="card-body">
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <div className="subheader">Securities</div>
                                                                                                    </div>
                                                                                                    <div className="h1 mb-3">{Number(getFinalPortfolioValue(clientCode).toFixed(2)).toLocaleString("en-US")}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="card bg-gray-700">
                                                                                                <div className="card-body">
                                                                                                    <div className="d-flex align-items-center">
                                                                                                        <div className="subheader">Total Wealth</div>
                                                                                                    </div>
                                                                                                    <div className="h1 mb-3">{(Number((getFinalLedgerBalance(clientCode) + getFinalPortfolioValue(clientCode)).toFixed(2))).toLocaleString("en-US")}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="table-responsive">

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className={`card-body p-0 ${currentTab == clientCode + "_alldata" ? '' : 'd-none'}`}>
                                                                            <div className="card-body p-0 border-0">
                                                                                <div className="card border-0">
                                                                                    <div className="card-header">
                                                                                        <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                                                                                            {
                                                                                                allTradeDataGroupedKeys[clientCode].length > 0 && allTradeDataGroupedKeys[clientCode].map((yearKey, indx) => {
                                                                                                    return (
                                                                                                        <li
                                                                                                            className="nav-item cursor-pointer"
                                                                                                            role="presentation"
                                                                                                            onClick={() => setCurrentAllTradeDataGroupedTab('alldatatab_' + clientCode + yearKey)}
                                                                                                        >
                                                                                                            <span className={`nav-link ${currentAllTradeDataGroupedTab == 'alldatatab_' + clientCode + yearKey ? 'active' : ''}`} role="tab">{yearKey}</span>
                                                                                                        </li>
                                                                                                    )
                                                                                                })}
                                                                                        </ul>
                                                                                    </div>
                                                                                    {allTradeDataGroupedKeys[clientCode].length > 0 && allTradeDataGroupedKeys[clientCode].map((yearKey, indx) =>
                                                                                    (<div className={`card-header ${currentAllTradeDataGroupedTab == 'alldatatab_' + clientCode + yearKey ? '' : 'd-none'}`} >
                                                                                        <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                                                                                            {months.length > 0 && months.map((month, indx) => {
                                                                                                const monthKey = `${month.formattedStart}_to_${month.formattedEnd}`
                                                                                                if (monthKey in allTradeDataGrouped[clientCode][yearKey]) {
                                                                                                    return (
                                                                                                        <li
                                                                                                            className="nav-item cursor-pointer"
                                                                                                            role="presentation"
                                                                                                            onClick={() => setCurrentAllTradeDataTab('alldatatab_' + clientCode + month.formattedEnd)}
                                                                                                        >
                                                                                                            <span className={`nav-link ${currentAllTradeDataTab == 'alldatatab_' + clientCode + month.formattedEnd ? 'active' : ''}`} role="tab">{moment(month.formattedEnd).format("MMM YYYY")}</span>
                                                                                                        </li>
                                                                                                    )
                                                                                                }
                                                                                            })}
                                                                                        </ul>
                                                                                    </div>
                                                                                    ))}
                                                                                    {months.length > 0 && months.map((wke, indx) => {
                                                                                        const wekkKey = `${wke.formattedStart}_to_${wke.formattedEnd}`
                                                                                        const wkData = allTradeData && clientCode in allTradeData && wekkKey in allTradeData[clientCode]["tradeData"] ? allTradeData[clientCode]["tradeData"][wekkKey] : null
                                                                                        if (wkData) {
                                                                                            const formatted_ledger = "LEDGER" in wkData ? wkData["LEDGER"] : []
                                                                                            const formatted_fno_profits = "FNO_PROFITS" in wkData ? wkData["FNO_PROFITS"] : []
                                                                                            const formatted_portfolio_value = "PORTFOLIO_VALUE" in wkData ? wkData["PORTFOLIO_VALUE"] : []
                                                                                            const formatted_etf_gains = "ETF_TRANSACTION_REPORT" in wkData && "ETF_HOLDING_VALUATION" in wkData && "ETF_HOLDING_VALUATIONPrevious" in wkData ? { ETF_TRANSACTION_REPORT: wkData["ETF_TRANSACTION_REPORT"], ETF_HOLDING_VALUATION: wkData["ETF_HOLDING_VALUATION"], ETF_HOLDING_VALUATIONPrevious: wkData["ETF_HOLDING_VALUATIONPrevious"] } : []
                                                                                            return (
                                                                                                <div className={`card-body border-0 p-0 ${currentAllTradeDataTab == 'alldatatab_' + clientCode + wke.formattedEnd ? '' : 'd-none'}`}>
                                                                                                    <h2 className="px-4 py-2 mt-4">Ledger</h2>
                                                                                                    <LedgerDBTable ledgerRecords={formatted_ledger} />
                                                                                                    <h2 className="px-4 pt-4">FnO Profits</h2>
                                                                                                    <FnODBTable records={formatted_fno_profits} />
                                                                                                    <h2 className="px-4 pt-4">Portfolio Value</h2>
                                                                                                    <PortfolioValueDBTable records={formatted_portfolio_value} />
                                                                                                    <h2 className="px-4 pt-4">ETF Gains</h2>
                                                                                                    <ETFDBTable records={formatted_etf_gains} />
                                                                                                </div>
                                                                                            )
                                                                                        }
                                                                                        return (<div className={`card-body border-0 p-0 ${currentAllTradeDataTab == 'alldatatab_' + clientCode + wke.formattedEnd ? '' : 'd-none'}`}>No data found</div>)
                                                                                    })}

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </ApplicationLayout>
        </>
    )
}
