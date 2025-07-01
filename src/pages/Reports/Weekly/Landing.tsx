import { ApplicationLayout } from "@/components";
import { Client } from "@/pages/Clients/core/_models";
import { getClientAUMRecords, getClientBrokerRecords, getClientProfitsRecords, getRecords as getClientsRecords } from "@/pages/Clients/core/_requests";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import moment, { Moment } from "moment";
import { getAllTradeData } from "../core/_requests";
import { calcTotalETFGainsLiquidDB, calcTotalETFGainsOthersDB, calculatePercentage, sumOfValuesForKey } from "@/utils";
import { stringifyRequestQuery } from "@/utils/libs/crud-helper";
import { LedgerDBTable } from "@/pages/TradeData/Ledger/LedgerDBTable";
import { FnODBTable } from "@/pages/TradeData/FnOProfits/FnODBTable";
import { PortfolioValueDBTable } from "@/pages/TradeData/PortfolioValue/PortfolioValueDBTable";
import { ETFDBTable } from "@/pages/TradeData/ETFGains/ETFDBTable";
import * as XLSX from 'xlsx';
import Select from 'react-select'

type Props = {
    children?: React.ReactNode
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

interface Week {
    start: moment.Moment;
    end: moment.Moment;
    key: string;
    formattedStart: string;
    formattedEnd: string;
}

export default function Landing(props: Props) {
    const { children } = props
    const [isAngelLoading, setAngelLoading] = useState<boolean>(false)
    const [isDownloadingReport, setIsDownloadingReport] = useState<boolean>(false)
    const [isIIFLLoading, setIIFLoading] = useState<boolean>(false)
    const [clients, setClients] = useState<Client[]>([])
    const [clientsForDropdown, setClientsForDropdown] = useState<Client[]>([])
    const [clientId, setClientId] = useState(null)
    const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"))
    const [selectedStartDate, setSelectedStartDate] = useState<string>(moment("2024-04-01","YYYY-MM-DD").format("YYYY-MM-DD"))
    const [selectedClient, setSelectedClient] = useState(null)
    const [isGenerateReport, setIsGenerateReport] = useState(false)
    const [selectedClientCode, setSelectedClientCode] = useState(null)
    const [currentClientCodeTab, setCurrentClientCodeTab] = useState<string>(null)
    const [currentTab, setCurrentTab] = useState<string>("report")
    const [weeks, setWeeks] = useState([])
    const [allTradeData, setAllTradeData] = useState({})
    const [currentAllTradeDataTab, setCurrentAllTradeDataTab] = useState<string>()
    const areaRef = useRef(null);

    function closestPreviousSaturday(date) {
        // const closest = new Date(date);
        // const dayOfWeek = closest.getDay();
        // if (dayOfWeek === 6) {
        //     return closest;
        // }
        // const daysToSubtract = dayOfWeek === 5 ? 0 : dayOfWeek + 1;
        // closest.setDate(closest.getDate() - daysToSubtract);
        const closest = moment(date,"YYYY-MM-DD").endOf('week').utcOffset("+5:30");
        return closest.toDate();
    }
    function formatDate(date) {
        // Get the day, month, and year components of the date
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based, so we add 1
        const year = date.getFullYear();
    
        // Pad single-digit day and month with leading zeros
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;
    
        // Format the date string as "DD-MM-YYYY"
        // return formattedDay + '-' + formattedMonth + '-' + year;
        return year + '-' + formattedMonth + '-' + formattedDay;
    }
    function calculateTotalWeeks(startDate, endDate) {
        const startMilliseconds = startDate.getTime();
        const endMilliseconds = endDate.getTime();
        const differenceMilliseconds = Math.abs(endMilliseconds - startMilliseconds);
        const totalWeeks = Math.ceil(differenceMilliseconds / (1000 * 60 * 60 * 24 * 7));
        return totalWeeks;
    }
    // function getWeekDateRanges(startingSaturday, totalWeeks = 5) {
    //     const weekDateRanges = [];
    //     const startingSaturdayCopy = startingSaturday
    //     for (let i = 0; i < totalWeeks; i++) {
    //         const endOfWeek = new Date(startingSaturdayCopy);
    //         const startOfWeek = new Date(startingSaturdayCopy);
    //         // endOfWeek.setDate(endOfWeek.getDate() - (i * 7));
    //         endOfWeek.setDate(endOfWeek.getDate());
    //         startOfWeek.setDate(endOfWeek.getDate() - 6);
    //         const formattedStart = formatDate(startOfWeek)
    //         const formattedEnd = formatDate(endOfWeek)
    //         weekDateRanges.push({
    //             key: `${formattedStart}_to_${formattedEnd}`,
    //             start: startOfWeek,
    //             end: endOfWeek,
    //             formattedStart,
    //             formattedEnd
    //         });
    //         startingSaturdayCopy.setDate(startingSaturday.getDate() - 7);
    //     }
    //     setCurrentAllTradeDataTab('alldatatab_'+weekDateRanges[weekDateRanges.length-1].formattedEnd)
    //     return weekDateRanges;
    // }

    function getWeekDateRanges(startDate, endDate) {
		const weekDateRanges = [];
		const weekStart = 0;
		const weekEnd = 6;
		// Determine financial year start/end based on the start date
		let financialYearStart = moment(startDate).startOf('year').month(3); // Financial year starts from April
		let financialYearEnd = moment(financialYearStart).add(1, 'year').subtract(1, 'day'); // Financial year ends on 31st March next year

		// Adjust financial year start/end if necessary
		while (financialYearStart.isAfter(endDate)) {
			financialYearStart.subtract(1, 'year');
			financialYearEnd.subtract(1, 'year');
		}

		// let currentWeekStart = moment(startDate).startOf('week').day(weekStart); // Start the week on Sunday
		let currentWeekStart = moment(startDate); // Start the week on Sunday
		let currentWeekEnd = moment(currentWeekStart).endOf('week').day(weekEnd); // End the week on Saturday

		while (currentWeekEnd.isSameOrBefore(endDate, 'day')) {
			if (currentWeekStart.isSameOrBefore(financialYearEnd) && currentWeekEnd.isSameOrAfter(financialYearEnd)) {
				weekDateRanges.push({ key: `${currentWeekStart.format('YYYY-MM-DD')}_to_${financialYearEnd.format('YYYY-MM-DD')}`, start: currentWeekStart, end: financialYearEnd, formattedStart: currentWeekStart.format('YYYY-MM-DD'), formattedEnd: financialYearEnd.format('YYYY-MM-DD') });

				// If the financial year end/start falls within the same week, continue with the next financial year
				// financialYearStart.add(1, 'year').startOf('year').month(3); // Financial year starts from April
				// financialYearEnd = moment(financialYearStart).add(1, 'year').subtract(1, 'day'); // Financial year ends on 31st March next year
				
				currentWeekStart = moment(financialYearEnd).add(1, 'day'); // Move to the next day after financial year end
				currentWeekEnd = moment(currentWeekStart).endOf('week').day(weekEnd); // End the week on Saturday
				if(currentWeekStart.day() >= weekEnd){
					currentWeekEnd = moment(currentWeekStart).add(1,'day'); // End the week on Saturday
				}
				financialYearEnd = moment(financialYearEnd).add(1, 'year');
				continue;
			}

			// Add the current week's date range to the array
            if(currentWeekStart.month() == 2 && currentWeekEnd.month() == 3){
            //     weekDateRanges.push({ key: `${currentWeekEnd.startOf('month').format('YYYY-MM-DD')}_to_${currentWeekEnd.format('YYYY-MM-DD')}`, start: currentWeekEnd.startOf('month'), end: currentWeekEnd, formattedStart: currentWeekEnd.startOf('month').format('YYYY-MM-DD'), formattedEnd: currentWeekEnd.format('YYYY-MM-DD') });
                // console.log(currentWeekEnd.clone().startOf('month').format('YYYY-MM-DD'));
                weekDateRanges.push({ key: `${currentWeekEnd.clone().startOf('month').format('YYYY-MM-DD')}_to_${currentWeekEnd.format('YYYY-MM-DD')}`, start: currentWeekEnd.clone().startOf('month'), end: currentWeekEnd, formattedStart: currentWeekEnd.clone().startOf('month').format('YYYY-MM-DD'), formattedEnd: currentWeekEnd.format('YYYY-MM-DD') });
            }else{
                weekDateRanges.push({ key: `${currentWeekStart.format('YYYY-MM-DD')}_to_${currentWeekEnd.format('YYYY-MM-DD')}`, start: currentWeekStart, end: currentWeekEnd, formattedStart: currentWeekStart.format('YYYY-MM-DD'), formattedEnd: currentWeekEnd.format('YYYY-MM-DD') });
            }
			

			// Move to the next week
			currentWeekStart = moment(currentWeekEnd).add(7-weekEnd, 'day').startOf('week').day(weekStart); // Move to the next Sunday
			currentWeekEnd = moment(currentWeekStart).endOf('week').day(weekEnd); // End the week on Saturday
		}
		return weekDateRanges;

	}

    function getWeekDateRanges_Old(startDate: string, endDate: string): { start: moment.Moment, end: moment.Moment, key: string, formattedStart: string, formattedEnd: string }[] {
        const weeks: Week[] = [];
        const DATE_FORMAT = 'YYYY-MM-DD';
        
        // Convert input dates to moment objects
        let currentStart = moment(startDate).startOf('day');
        const finalEnd = moment(endDate).endOf('day');
        
        // Adjust currentStart to previous Sunday if it's not already Sunday
        if (currentStart.day() !== 0) {
            currentStart = currentStart.day(0); // 0 is Sunday
        }

        while (currentStart.isBefore(finalEnd)) {
            let weekEnd: Moment;
            
            // Check if we're approaching financial year end (March 31st)
            const currentYear = currentStart.year();
            const financialYearEnd = moment(`${currentYear}-03-31`, DATE_FORMAT);
            const nextFinancialYearStart = moment(`${currentYear}-04-01`, DATE_FORMAT);
            
            // If current week includes March 31st
            if (currentStart.isSameOrBefore(financialYearEnd) && 
                financialYearEnd.isBefore(currentStart.clone().add(6, 'days'))) {
            weekEnd = financialYearEnd.clone();
            } 
            // If we're after March 31st, start new week from April 1st
            else if (currentStart.isSame(nextFinancialYearStart)) {
            weekEnd = currentStart.clone().day(6); // Saturday
            }
            // Normal week ending on Saturday
            else {
            weekEnd = currentStart.clone().day(6); // Saturday
            }

            // Ensure weekEnd doesn't exceed finalEnd
            if (weekEnd.isAfter(finalEnd)) {
            weekEnd = finalEnd.clone();
            }

            // Create week object
            const week: Week = {
            start: currentStart.clone(),
            end: weekEnd.clone(),
            key: `${currentStart.format(DATE_FORMAT)}_to_${weekEnd.format(DATE_FORMAT)}`,
            formattedStart: currentStart.format(DATE_FORMAT),
            formattedEnd: weekEnd.format(DATE_FORMAT)
            };

            weeks.push(week);

            // Move to next week
            // If we just ended on March 31st, next week starts April 1st
            if (weekEnd.isSame(financialYearEnd)) {
            currentStart = nextFinancialYearStart;
            } 
            // Otherwise, start next Sunday
            else {
            currentStart = weekEnd.clone().add(1, 'day');
            if (currentStart.day() !== 0) {
                currentStart.day(0); // Move to next Sunday
            }
            }
        }

        return weeks;
    }
    

    function getNextMondayFromDate(date) {
        // Parse the input date using Moment.js
        const inputDate = moment(date, 'YYYY-MM-DD');
        
        // Find the next Monday using Moment.js methods
        // const nextMonday = inputDate.clone().startOf('isoWeek').add(7, 'days');
        const nextMonday = inputDate.clone().startOf('week').add(7, 'days');
        
        return nextMonday.format('YYYY-MM-DD');
    }
    

    async function loadClients() {
        try {
          const response = await getClientsRecords()
          const recordsList = response?.data || [];
          setClients(recordsList)
          if(recordsList.length > 0){
            const clientListForDropDown = recordsList.map(({ uuid, name }) => ({ uuid, name }))
            setClientsForDropdown(clientListForDropDown);
          }
        } catch (error) {
          const err = error as AxiosError
          return err
        }
    }

    async function loadTradeData() {
        setAllTradeData({})
        const cloestSatDate = closestPreviousSaturday(selectedDate)
        const selectedStartDateMoment = moment(selectedStartDate,"YYYY-MM-DD")
        const cloestSatDateCopy = moment(cloestSatDate).clone().toDate()
        // let lastFiveWeeksDateRanges = getWeekDateRanges(cloestSatDate)
        // let lastFiveWeeksDateRanges1 = getWeekDateRanges_Old(moment(cloestSatDate).clone().subtract(5,'weeks').startOf('week'),cloestSatDate)
        // console.log("lastFiveWeeksDateRanges1",lastFiveWeeksDateRanges1)
        // if(selectedStartDateMoment.isBefore(cloestSatDate)){
        //     lastFiveWeeksDateRanges = getWeekDateRanges(selectedStartDateMoment.clone().startOf('week'),cloestSatDate)
        // }
        let lastFiveWeeksDateRanges = getWeekDateRanges(selectedStartDate,selectedDate)
        // console.log("lastFiveWeeksDateRanges",lastFiveWeeksDateRanges)
        lastFiveWeeksDateRanges.sort((a,b) => a.end-b.end)
        setWeeks(lastFiveWeeksDateRanges)
        // console.log("clientId",clientId);
        await Promise.all(clientId.map(async (clientIdObj) => {
            const clientDetails = clients.find((client) => client.uuid == clientIdObj.value);
            const clientBrokersResponse = await getClientBrokerRecords(clientIdObj.value);
            const clientBrokers = clientBrokersResponse?.data || [];
            let allClientBrokerTradeData = {}
            await Promise.all(clientBrokers.map(async (clientBroker) => {
                setAngelLoading(true)
                const qry = {
                    "filter": {
                        "start_date": moment(cloestSatDate).format("YYYY-MM-DD"),
                        "client_broker_id": clientBroker.broker.id
                    },
                    "items_per_page": 100000000000
                }
                const responseProfits = await getClientProfitsRecords(clientIdObj.value,stringifyRequestQuery(qry))
                if(responseProfits.data && responseProfits.data.length > 0){
                    const profitsData = responseProfits.data
                    //@ts-ignore
                    profitsData.sort((a, b) => new Date(a.settledDate) - new Date(b.settledDate));
                    const latestProfitsSettledDate = moment(profitsData[profitsData.length-1]["settledDate"]).utcOffset("+5:30").format("YYYY-MM-DD")
                    const cloestSatDateNew = closestPreviousSaturday(selectedDate)
                    const totalWeeks = calculateTotalWeeks(new Date(getNextMondayFromDate(latestProfitsSettledDate)),new Date(moment(cloestSatDateNew).format("YYYY-MM-DD")))
                    // lastFiveWeeksDateRanges = getWeekDateRanges(cloestSatDateNew,totalWeeks)
                    if(moment(latestProfitsSettledDate).isSameOrBefore(moment(cloestSatDateNew)) && moment(latestProfitsSettledDate).isBefore(selectedStartDateMoment)){
                        // lastFiveWeeksDateRanges = getWeekDateRanges(latestProfitsSettledDate,new Date(moment(cloestSatDateNew).format("YYYY-MM-DD")))
                    }
                    // lastFiveWeeksDateRanges.sort((a,b) => a.end-b.end)
                }
                // setWeeks(lastFiveWeeksDateRanges)
                const reqData = {
                    "generate_html_report": isGenerateReport ? "weekly" : "none",
                    "dates": lastFiveWeeksDateRanges,
                    "client_id": clientIdObj.value,
                    "client_broker_id": clientBroker.uuid
                }
                setSelectedClientCode(clientBroker.clientCode)
                setAngelLoading(true)
                try{
                    const allTradeDataResponse = await getAllTradeData(reqData)
                    if(allTradeDataResponse.status == 201){
                        let dataAll = allTradeDataResponse.data;
                        // if(!(clientBroker.clientCode in allTradeData)){
                            const allTradeDataCp = allTradeData
                            allTradeDataCp[clientBroker.clientCode] = {"clientDetails":clientDetails,"tradeData":dataAll}
                            setAllTradeData(allTradeDataCp)
                        // }
                        // allClientBrokerTradeData[clientBroker.clientCode] = dataAll
                        // setAllTradeData(dataAll)
                    }
                    // setAngelLoading(false)
                }catch(e){
                    console.log("angel error", e)
                    setAngelLoading(false)
                }
            }))
            // setAngelLoading(false)
        }))
        // console.log("allTradeData",allTradeData)
        // setAllTradeData(dataAll)
        setAngelLoading(false)
    }

    const exportTablesToExcel = (clientCode) => {
        console.log("clientCode",clientCode)
        setIsDownloadingReport(true)
        if(clientCode in allTradeData){
            const allTradeDataDateKeyTradeData = allTradeData[clientCode]['tradeData']
            const allTradeDataKeys = Object.keys(allTradeDataDateKeyTradeData)
            if(allTradeDataKeys.length > 0){
                try{
                    const wb = XLSX.utils.book_new();
                    const weeklyReportTable = areaRef.current.querySelector('.weekly-report-'+clientCode);
                    const ws = XLSX.utils.table_to_sheet(weeklyReportTable);
                    XLSX.utils.book_append_sheet(wb, ws, `Report`);
                    allTradeDataKeys.forEach((dateKeys) => {
                        const ws = XLSX.utils.aoa_to_sheet([]); // Create an empty worksheet
                        let currentRow = 1; // Start from the first row
                        const weekData = allTradeDataDateKeyTradeData[dateKeys];
                        Object.keys(weekData).forEach((key) => {
                            if(key != "date" && key != "datekey" && key != "aum" && key != "profits"){
                                const data = weekData[key];
                                if (data.length > 0) {
                                    // Add the key as a heading
                                    XLSX.utils.sheet_add_aoa(ws, [[""]], { origin: { r: currentRow - 1, c: 0 } });
                                    currentRow++; // Move to the next row
                                    XLSX.utils.sheet_add_aoa(ws, [[key]], { origin: { r: currentRow - 1, c: 0 } });
                                    currentRow++; // Move to the next row

                                    // Dynamically determine headers from the keys of the first object
                                    let headers = Object.keys(data[0]);
                                    headers = headers.filter(item => item !== "_id" && item !== "clientId" && item !== "clientBrokerAccountId" && item !== "brokerId" && item !== "scrappedData")
                                    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: { r: currentRow - 1, c: 0 } });
                                    // Add data rows
                                    data.forEach(obj => {
                                        const rowData = headers.map(header => obj[header]);
                                        XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: { r: currentRow, c: 0 } });
                                        currentRow++; // Move to the next row for the next object
                                    });

                                    // Add an empty row after each data set for visual separation
                                    currentRow++;
                                }
                            }
                        });
                        // console.log("dateKeys",dateKeys)
                        // const weekData = allTradeData[dateKeys];
                        // console.log("weekData",weekData)
                        const dateKeySplit = dateKeys.split("_to_")
                        // const ws = XLSX.utils.json_to_sheet();
                        XLSX.utils.book_append_sheet(wb, ws, `All Data ${dateKeySplit[1]}`);
                    })
                    XLSX.writeFile(wb, `Weekly Report ${clientCode} ${selectedDate}.xlsx`);   
                }catch(E){
                    console.log("download error", E)
                    setIsDownloadingReport(false)        
                }
            }else{
                alert("No report generated");
            }
        }else{
            alert("No report generated");
        }
        setIsDownloadingReport(false)
    };

    const allWeeksResults = {}
    const allWeeksResultsPercentage = {}

    if(allTradeData && Object.keys(allTradeData).length > 0){
        Object.keys(allTradeData).map((code) => {
            allWeeksResults[code] = []
            allWeeksResultsPercentage[code] = []
        })
    }

    useEffect(() => {
        loadClients()   
    },[])

    return (
    <>  
        <ApplicationLayout>
            <main ref={areaRef}>
                <div className="page-body">
                    <div className="container-xl">
                        <div className=" mx-auto">
                            <div className="flex flex-col">
                                <div className="-m-1.5 overflow-x-auto">
                                    <div className="p-1 min-w-full inline-block align-middle">
                                        <div className="col-12">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h3 className="card-title">Client Weekly Report</h3>
                                                    <div className="card-actions">
                                                        {/* <button className="btn" disabled={isDownloadingReport} onClick={exportTablesToExcel}>{isDownloadingReport ? 'Downloading...' : 'Download Report'}</button> */}
                                                    </div>
                                                </div>
                                                <div className="card-body border-0 py-3">
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
                                                            <label className="form-check me-2 pt-2">
                                                                <input className="form-check-input"
                                                                defaultChecked={isGenerateReport}
                                                                type="checkbox" onChange={(e) => {
                                                                    if(e.target.checked){
                                                                        setIsGenerateReport(true)
                                                                    }else{
                                                                        setIsGenerateReport(false)
                                                                    }
                                                                }} />
                                                                <span className="form-check-label">
                                                                    Generate HTML Report
                                                                </span>
                                                            </label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <input type="date" className="form-control" placeholder="YYYY-MM-DD"
                                                            defaultValue={selectedStartDate}
                                                            onChange={(e) => setSelectedStartDate(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <input type="date" className="form-control" placeholder="YYYY-MM-DD"
                                                            defaultValue={selectedDate}
                                                            onChange={(e) => setSelectedDate(e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <div className="d-flex">
                                                            <button type="button" className="btn btn-primary"
                                                            disabled={isAngelLoading || isIIFLLoading}
                                                            onClick={() => loadTradeData()}
                                                            >{isAngelLoading || isIIFLLoading ? 'Loading...' : 'Submit'}</button>
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
                                                                        onClick={() => setCurrentTab(clientCode+'_report')}
                                                                        >
                                                                            <span className={`nav-link ${currentTab == clientCode+"_report" ? 'active' : ''}`} role="tab">Report</span>
                                                                        </li>
                                                                        <li 
                                                                        className="nav-item cursor-pointer" 
                                                                        role="presentation"
                                                                        onClick={() => setCurrentTab(clientCode+'_alldata')}
                                                                        >
                                                                            <span className={`nav-link ${currentTab == clientCode+"_alldata" ? 'active' : ''}`} role="tab">All Data</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                                <div className={`card-body p-0 ${currentTab == clientCode+"_report" ? '' : 'd-none'}`}>
                                                                    <div className="table-responsive">
                                                                        <table className={`weekly-report-${clientCode} table table-vcenter table-bordered table-nowrap card-table`}>
                                                                            <thead>
                                                                                <tr>
                                                                                    <td className="w-50">
                                                                                        <h2 className="p-0 m-o">{clientCode in allTradeData ? allTradeData[clientCode]["clientDetails"]["name"] : ''}
                                                                                        <div className="text-secondary text-wrap fs-5">Client Code: {clientCode}</div>
                                                                                        </h2>
                                                                                        
                                                                                        {isGenerateReport && (<a target="_blank" href={`${process.env.DO_SPACES_BUCKET_CDN_URL}reports/weekly/${clientCode}/${selectedDate}.html`} className="btn-link me-2">HTML Report</a>)}
                                                                                        <a onClick={() => exportTablesToExcel(clientCode)} className="btn-link me-2 cursor-pointer">Download Data</a>
                                                                                        {/* <button className="btn" disabled={isDownloadingReport} onClick={exportTablesToExcel}>{isDownloadingReport ? 'Downloading...' : 'Download Report'}</button> */}
                                                                                    </td>
                                                                                    {weeks.map((week, indx) => {
                                                                                        // if(indx > weeks.length - 5 && indx != weeks.length - 1){
                                                                                        // if(indx < 110){
                                                                                        //     return (
                                                                                        //         <td className="text-center">
                                                                                        //             <div className="text-uppercase text-secondary font-weight-medium">WEEK</div>
                                                                                        //             <div className="display-9 my-3"><span className="fw-bold">{week.formattedStart}</span> <br/>to<br/> <span className="fw-bold">{week.formattedEnd}</span></div>
                                                                                        //         </td>
                                                                                        //     )
                                                                                        // }
                                                                                        // if(indx == weeks.length - 1){
                                                                                            return (
                                                                                                <td className="text-center">
                                                                                                    <div className="text-uppercase text-secondary font-weight-medium">CURRENT WEEK</div>
                                                                                                    <div className="display-9 fw-bold my-3">{week.formattedStart} <br/>to<br/> {week.formattedEnd}</div>
                                                                                                </td>
                                                                                            )
                                                                                        // }
                                                                                    })}
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td>AUM</td>
                                                                                    {allTradeData && clientCode in allTradeData && weeks.map((week, indx) => {
                                                                                        const dateKey = `${week['formattedStart']}_to_${week['formattedEnd']}`
                                                                                        // if(indx > weeks.length - 5 && dateKey in allTradeData){
                                                                                        if(dateKey in allTradeData[clientCode]["tradeData"]){
                                                                                            const weekReportData = allTradeData[clientCode]["tradeData"][dateKey]
                                                                                            if(weekReportData){
                                                                                                return (
                                                                                                    <td className="text-center">
                                                                                                        {"aum" in weekReportData && weekReportData["aum"].length > 0 ? Number(weekReportData["aum"][0]["amount"]).toLocaleString("en-US") : "N/A"}
                                                                                                    </td>
                                                                                                )
                                                                                            }
                                                                                        }
                                                                                        return (
                                                                                            <td className="text-center">N/A</td>
                                                                                        )
                                                                                    })}
                                                                                </tr>
                                                                                <tr className="bg-light">
                                                                                    <th colSpan={5} className="subheader">Week</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Results</td>
                                                                                    {allTradeData && clientCode in allTradeData && weeks.map((week, indx) => {
                                                                                        const dateKey = `${week['formattedStart']}_to_${week['formattedEnd']}`
                                                                                        // if(indx > weeks.length - 5 && dateKey in allTradeData){
                                                                                        if(dateKey in allTradeData[clientCode]["tradeData"]){
                                                                                            const weekReportData = allTradeData[clientCode]["tradeData"][dateKey]
                                                                                            let previousWeekReportData = null
                                                                                            if(indx > 0){
                                                                                                const dateKeyPrev = `${weeks[indx-1]['formattedStart']}_to_${weeks[indx-1]['formattedEnd']}`
                                                                                                if(dateKeyPrev in allTradeData[clientCode]["tradeData"]){
                                                                                                    previousWeekReportData = allTradeData[clientCode]["tradeData"][dateKeyPrev]
                                                                                                }
                                                                                            }
                                                                                            if(weekReportData){
                                                                                                const clientBrokerDetails = allTradeData[clientCode]["clientDetails"]["brokerDetails"].find(brokerDetails => brokerDetails.clientCode == clientCode)
                                                                                                console.log("clientBrokerDetails2",clientCode,clientBrokerDetails)
                                                                                                let charges = 0, totalETFGains = 0, totalFnOPNL = 0, totalAdjustments = 0
                                                                                                totalAdjustments = "adjustments" in weekReportData && weekReportData["adjustments"].length > 0 ? sumOfValuesForKey(weekReportData["adjustments"],"amount") : 0
                                                                                                if("LEDGER" in weekReportData && weekReportData["LEDGER"].length > 0){
                                                                                                    const filteredLedger = weekReportData["LEDGER"].filter((item) => item.category.includes("charge"))
                                                                                                    charges = sumOfValuesForKey(filteredLedger,"debit")
                                                                                                }
                                                                                                if("FNO_PROFITS" in weekReportData && weekReportData["FNO_PROFITS"].length > 0){
                                                                                                    const grossPNL = sumOfValuesForKey(weekReportData["FNO_PROFITS"],"grossPNL")
                                                                                                    const totalCharges = sumOfValuesForKey(weekReportData["FNO_PROFITS"],"charges")
                                                                                                    totalFnOPNL = grossPNL-totalCharges
                                                                                                }
                                                                                                if("ETF_TRANSACTION_REPORT" in weekReportData && "ETF_HOLDING_VALUATION" in weekReportData && "ETF_HOLDING_VALUATIONPrevious" in weekReportData){
                                                                                                    // console.log(dateKey,weekReportData)
                                                                                                    if(previousWeekReportData){
                                                                                                        weekReportData["ETF_TRANSACTION_REPORT_Prev"] = previousWeekReportData["ETF_TRANSACTION_REPORT"]
                                                                                                        weekReportData["ETF_HOLDING_VALUATION_Prev"] = previousWeekReportData["ETF_HOLDING_VALUATION"]
                                                                                                        weekReportData["ETF_HOLDING_VALUATIONPrevious_Prev"] = previousWeekReportData["ETF_HOLDING_VALUATIONPrevious"]
                                                                                                    }
                                                                                                    const totalLiquidBeesGains = calcTotalETFGainsLiquidDB(weekReportData,clientBrokerDetails);
                                                                                                    const totalOtherETFGains = calcTotalETFGainsOthersDB(weekReportData,clientBrokerDetails);
                                                                                                    // @ts-ignore
                                                                                                    totalETFGains = parseFloat(totalLiquidBeesGains) + parseFloat(totalOtherETFGains)
                                                                                                }
                                                                                                const result = ((totalFnOPNL+totalETFGains)-charges)+totalAdjustments;
                                                                                                allWeeksResults[clientCode].push(result)
                                                                                                // if(indx > weeks.length - 5){
                                                                                                    return (
                                                                                                        <td className={`text-center ${result < 0 ? 'text-danger' : 'text-success'}`}>
                                                                                                            <strong>{Number((result).toFixed(2)).toLocaleString('en-US')}<br/>
                                                                                                            FnO: {Number((totalFnOPNL).toFixed(2)).toLocaleString('en-US')}<br/>
                                                                                                            ETF Gains: {Number((totalETFGains).toFixed(2)).toLocaleString('en-US')}<br/>
                                                                                                            Charges: {Number((charges).toFixed(2)).toLocaleString('en-US')}<br/>
                                                                                                            </strong>
                                                                                                        </td>
                                                                                                    )
                                                                                                // }
                                                                                            }
                                                                                        }
                                                                                        return (
                                                                                            <td className="text-center">N/A</td>
                                                                                        )
                                                                                    })}
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>% Gain/Loss</td>
                                                                                    {allTradeData && clientCode in allTradeData && weeks.map((week, indx) => {
                                                                                        const dateKey = `${week['formattedStart']}_to_${week['formattedEnd']}`
                                                                                        // if(indx > weeks.length - 5 && dateKey in allTradeData){
                                                                                        if(dateKey in allTradeData[clientCode]["tradeData"]){
                                                                                            const weekReportData = allTradeData[clientCode]["tradeData"][dateKey]
                                                                                            let previousWeekReportData = null
                                                                                            if(indx > 0){
                                                                                                const dateKeyPrev = `${weeks[indx-1]['formattedStart']}_to_${weeks[indx-1]['formattedEnd']}`
                                                                                                if(dateKeyPrev in allTradeData[clientCode]["tradeData"]){
                                                                                                    previousWeekReportData = allTradeData[clientCode]["tradeData"][dateKeyPrev]
                                                                                                }
                                                                                            }
                                                                                            if(weekReportData){
                                                                                                const clientBrokerDetails = allTradeData[clientCode]["clientDetails"]["brokerDetails"].find(brokerDetails => brokerDetails.clientCode == clientCode)
                                                                                                console.log("clientBrokerDetails1",clientCode,clientBrokerDetails)
                                                                                                let charges = 0, totalETFGains = 0, totalFnOPNL = 0, aum = 1, totalAdjustments = 0
                                                                                                aum = "aum" in weekReportData && weekReportData["aum"].length > 0 ? weekReportData["aum"][0]["amount"] : 1
                                                                                                totalAdjustments = "adjustments" in weekReportData && weekReportData["adjustments"].length > 0 ? sumOfValuesForKey(weekReportData["adjustments"],"amount") : 0
                                                                                                if("LEDGER" in weekReportData && weekReportData["LEDGER"].length > 0){
                                                                                                    const filteredLedger = weekReportData["LEDGER"].filter((item) => !item.category.includes("Ignore") && item.category.includes("charge"))
                                                                                                    charges = sumOfValuesForKey(filteredLedger,"debit")
                                                                                                }
                                                                                                if("FNO_PROFITS" in weekReportData && weekReportData["FNO_PROFITS"].length > 0){
                                                                                                    const grossPNL = sumOfValuesForKey(weekReportData["FNO_PROFITS"],"grossPNL")
                                                                                                    const totalCharges = sumOfValuesForKey(weekReportData["FNO_PROFITS"],"charges")
                                                                                                    totalFnOPNL = grossPNL-totalCharges
                                                                                                }
                                                                                                if("ETF_TRANSACTION_REPORT" in weekReportData && "ETF_HOLDING_VALUATION" in weekReportData && "ETF_HOLDING_VALUATIONPrevious" in weekReportData){
                                                                                                    // console.log(dateKey,weekReportData)
                                                                                                    if(previousWeekReportData){
                                                                                                        weekReportData["ETF_TRANSACTION_REPORT_Prev"] = previousWeekReportData["ETF_TRANSACTION_REPORT"]
                                                                                                        weekReportData["ETF_HOLDING_VALUATION_Prev"] = previousWeekReportData["ETF_HOLDING_VALUATION"]
                                                                                                        weekReportData["ETF_HOLDING_VALUATIONPrevious_Prev"] = previousWeekReportData["ETF_HOLDING_VALUATIONPrevious"]
                                                                                                    }
                                                                                                    const totalLiquidBeesGains = calcTotalETFGainsLiquidDB(weekReportData,clientBrokerDetails);
                                                                                                    const totalOtherETFGains = calcTotalETFGainsOthersDB(weekReportData,clientBrokerDetails);
                                                                                                    // @ts-ignore
                                                                                                    totalETFGains = parseFloat(totalLiquidBeesGains) + parseFloat(totalOtherETFGains)
                                                                                                }
                                                                                                const result = ((totalFnOPNL+totalETFGains)-charges)+totalAdjustments;
                                                                                                const resultsPercentage = calculatePercentage(result,aum)
                                                                                                allWeeksResultsPercentage[clientCode].push(resultsPercentage)
                                                                                                // if(indx > weeks.length - 5){
                                                                                                    return (
                                                                                                        <td className={`text-center ${resultsPercentage < 0 ? 'text-danger' : 'text-success'}`}>
                                                                                                            <strong>{resultsPercentage.toFixed(2)}%</strong>
                                                                                                        </td>
                                                                                                    )
                                                                                                // }
                                                                                            }
                                                                                        }
                                                                                        return (
                                                                                            <td className="text-center">N/A</td>
                                                                                        )
                                                                                    })}
                                                                                </tr>
                                                                                <tr className="bg-light">
                                                                                    <th colSpan={5} className="subheader">Cumulative</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Results</td>
                                                                                    {allTradeData && clientCode in allTradeData && weeks.map((week, indx) => {
                                                                                        const dateKey = `${week['formattedStart']}_to_${week['formattedEnd']}`
                                                                                        if(dateKey in allTradeData[clientCode]["tradeData"]){
                                                                                            const sum = allWeeksResults[clientCode].slice(0, indx + 1).reduce((acc, val) => acc + val, 0);
                                                                                            // if(indx > weeks.length - 5){
                                                                                                return (
                                                                                                    <td className={`text-center ${sum < 0 ? 'text-danger' : 'text-success'}`}>
                                                                                                        <strong>{Number((sum).toFixed(2)).toLocaleString('en-US')}</strong>
                                                                                                    </td>
                                                                                                )
                                                                                            // }
                                                                                        }
                                                                                        return (
                                                                                            <td className="text-center">N/A</td>
                                                                                        )
                                                                                    })}
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>% Gain/Loss</td>
                                                                                    {allTradeData && clientCode in allTradeData && weeks.map((week, indx) => {
                                                                                        const dateKey = `${week['formattedStart']}_to_${week['formattedEnd']}`
                                                                                        if(dateKey in allTradeData[clientCode]["tradeData"]){
                                                                                            const sum = allWeeksResultsPercentage[clientCode].slice(0, indx + 1).reduce((acc, val) => acc + val, 0);
                                                                                            // if(indx > weeks.length - 5){
                                                                                                return (
                                                                                                    <td className={`text-center text ${sum < 0 ? 'text-danger' : 'text-success'}`}>
                                                                                                        <strong>{Number((sum).toFixed(2)).toLocaleString('en-US')}%</strong>
                                                                                                    </td>
                                                                                                )
                                                                                            // }
                                                                                        }
                                                                                        return (
                                                                                            <td className="text-center">N/A</td>
                                                                                        )
                                                                                    })}
                                                                                </tr>
                                                                                <tr className="bg-light">
                                                                                    <th colSpan={5} className="subheader">Other</th>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Ledger Balance</td>
                                                                                    {allTradeData && clientCode in allTradeData && weeks.map((week, indx) => {
                                                                                        const dateKey = `${week['formattedStart']}_to_${week['formattedEnd']}`
                                                                                        // if(indx > weeks.length - 5 && dateKey in allTradeData){
                                                                                        if(dateKey in allTradeData[clientCode]["tradeData"]){
                                                                                            const weekReportData = allTradeData[clientCode]["tradeData"][dateKey]
                                                                                            if(weekReportData){
                                                                                                let ledgerBalance = "0"
                                                                                                if("LEDGER" in weekReportData && weekReportData["LEDGER"].length > 0){
                                                                                                    // const totalCredit = sumOfValuesForKey(weekReportData["LEDGER"],"credit")
                                                                                                    // const totalDebit = sumOfValuesForKey(weekReportData["LEDGER"],"debit")
                                                                                                    // ledgerBalance = (totalCredit - totalDebit).toFixed(2)
                                                                                                    ledgerBalance = weekReportData["LEDGER"][weekReportData["LEDGER"].length - 1]["balance"]
                                                                                                }
                                                                                                return (
                                                                                                    <td className="text-center">
                                                                                                        {Number(ledgerBalance).toLocaleString('en-US')}
                                                                                                    </td>
                                                                                                )
                                                                                            }
                                                                                        }
                                                                                        return (
                                                                                            <td className="text-center">N/A</td>
                                                                                        )
                                                                                    })}
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Portfolio Value</td>
                                                                                    {allTradeData && clientCode in allTradeData && weeks.map((week, indx) => {
                                                                                        const dateKey = `${week['formattedStart']}_to_${week['formattedEnd']}`
                                                                                        // if(indx > weeks.length - 5 && dateKey in allTradeData){
                                                                                        if(dateKey in allTradeData[clientCode]["tradeData"]){
                                                                                            const weekReportData = allTradeData[clientCode]["tradeData"][dateKey]
                                                                                            if(weekReportData){
                                                                                                let totalPortfolioValue = 0
                                                                                                if("PORTFOLIO_VALUE" in weekReportData && weekReportData["PORTFOLIO_VALUE"].length > 0){
                                                                                                    const lastPORTFOLIO_VALUE_entryDate = weekReportData["PORTFOLIO_VALUE"][weekReportData["PORTFOLIO_VALUE"].length-1]["entryDate"]
                                                                                                    // console.log(weekReportData["PORTFOLIO_VALUE"])
                                                                                                    weekReportData["PORTFOLIO_VALUE"].forEach(ele => {
                                                                                                        if(ele.entryDate == lastPORTFOLIO_VALUE_entryDate){
                                                                                                            // console.log('ele["holdingValue"]',lastPORTFOLIO_VALUE_entryDate,ele["holdingValue"])
                                                                                                            totalPortfolioValue += ele["holdingValue"]
                                                                                                        }
                                                                                                    })

                                                                                                    // totalPortfolioValue = sumOfValuesForKey(weekReportData["PORTFOLIO_VALUE"],"holdingValue")
                                                                                                    totalPortfolioValue = Number(totalPortfolioValue.toFixed(2))
                                                                                                }
                                                                                                return (
                                                                                                    <td className="text-center">
                                                                                                        {totalPortfolioValue.toLocaleString("en-US")}
                                                                                                    </td>
                                                                                                )
                                                                                            }
                                                                                        }
                                                                                        return (
                                                                                            <td className="text-center">N/A</td>
                                                                                        )
                                                                                    })}
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>Profit Settled</td>
                                                                                    {allTradeData && clientCode in allTradeData && weeks.map((week, indx) => {
                                                                                        const dateKey = `${week['formattedStart']}_to_${week['formattedEnd']}`
                                                                                        if(dateKey in allTradeData[clientCode]["tradeData"]){
                                                                                            const weekReportData = allTradeData[clientCode]["tradeData"][dateKey]
                                                                                            if(weekReportData){
                                                                                                return (
                                                                                                    <td className="text-center">
                                                                                                        {"profits" in weekReportData && weekReportData["profits"].length > 0 ? Number(weekReportData["profits"][0]["amount"]).toLocaleString("en-US") : "N/A"}
                                                                                                    </td>
                                                                                                )
                                                                                            }
                                                                                        }
                                                                                        return (
                                                                                            <td className="text-center">N/A</td>
                                                                                        )
                                                                                    })}
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                                <div className={`card-body p-0 ${currentTab == clientCode+"_alldata" ? '' : 'd-none'}`}>
                                                                    <div className="card border-0">
                                                                        <div className="card-header">
                                                                            <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                                                                            {weeks.length > 0 && weeks.map((wek,indx) => (
                                                                                <li 
                                                                                className="nav-item cursor-pointer" 
                                                                                role="presentation"
                                                                                onClick={() => setCurrentAllTradeDataTab('alldatatab_'+clientCode+wek.formattedEnd)}
                                                                                >
                                                                                    <span className={`nav-link ${currentAllTradeDataTab == 'alldatatab_'+clientCode+wek.formattedEnd ? 'active' : '' }`} role="tab">{wek.formattedEnd}</span>
                                                                                </li>
                                                                            ))}
                                                                            </ul>
                                                                        </div>
                                                                        {weeks.length > 0 && weeks.map((wke,indx) => {
                                                                            const wekkKey = `${wke.formattedStart}_to_${wke.formattedEnd}`
                                                                            const wkData = allTradeData && clientCode in allTradeData && wekkKey in allTradeData[clientCode]["tradeData"] ? allTradeData[clientCode]["tradeData"][wekkKey] : null
                                                                            const clientBrokerDetails = allTradeData[clientCode]["clientDetails"]["brokerDetails"].find(brokerDetails => brokerDetails.clientCode == clientCode)
                                                                            let previousWeekReportData = null
                                                                            if(indx > 0){
                                                                                const dateKeyPrev = `${weeks[indx-1]['formattedStart']}_to_${weeks[indx-1]['formattedEnd']}`
                                                                                if(dateKeyPrev in allTradeData[clientCode]["tradeData"]){
                                                                                    previousWeekReportData = allTradeData[clientCode]["tradeData"][dateKeyPrev]
                                                                                }
                                                                            }
                                                                            if(wkData){
                                                                                const formatted_ledger = "LEDGER" in wkData ? wkData["LEDGER"] : []
                                                                                const formatted_fno_profits = "FNO_PROFITS" in wkData ? wkData["FNO_PROFITS"] : []
                                                                                const formatted_portfolio_value = "PORTFOLIO_VALUE" in wkData ? wkData["PORTFOLIO_VALUE"] : []
                                                                                
                                                                                let formatted_etf_gains = {}
                                                                                if("ETF_TRANSACTION_REPORT" in wkData && "ETF_HOLDING_VALUATION" in wkData && "ETF_HOLDING_VALUATIONPrevious" in wkData){
                                                                                    formatted_etf_gains["ETF_TRANSACTION_REPORT"] = wkData["ETF_TRANSACTION_REPORT"]
                                                                                    formatted_etf_gains["ETF_HOLDING_VALUATION"] = wkData["ETF_HOLDING_VALUATION"]
                                                                                    formatted_etf_gains["ETF_HOLDING_VALUATIONPrevious"] = wkData["ETF_HOLDING_VALUATIONPrevious"]
                                                                                }
                                                                                if(previousWeekReportData && "ETF_TRANSACTION_REPORT" in previousWeekReportData && "ETF_HOLDING_VALUATION" in previousWeekReportData && "ETF_HOLDING_VALUATIONPrevious" in previousWeekReportData){
                                                                                    formatted_etf_gains["ETF_TRANSACTION_REPORT_Prev"] = previousWeekReportData["ETF_TRANSACTION_REPORT"]
                                                                                    formatted_etf_gains["ETF_HOLDING_VALUATION_Prev"] = previousWeekReportData["ETF_HOLDING_VALUATION"]
                                                                                    formatted_etf_gains["ETF_HOLDING_VALUATIONPrevious_Prev"] = previousWeekReportData["ETF_HOLDING_VALUATIONPrevious"]
                                                                                }
                                                                                return (
                                                                                    <div className={`card-body border-0 p-0 ${currentAllTradeDataTab == 'alldatatab_'+clientCode+wke.formattedEnd ? '' : 'd-none'}`}>
                                                                                        <h2 className="px-4 py-2 mt-4">Ledger</h2>
                                                                                        <LedgerDBTable ledgerRecords={formatted_ledger} />
                                                                                        <h2 className="px-4 pt-4">FnO Profits</h2>
                                                                                        <FnODBTable records={formatted_fno_profits} />
                                                                                        <h2 className="px-4 pt-4">Portfolio Value</h2>
                                                                                        <PortfolioValueDBTable records={formatted_portfolio_value} />
                                                                                        <h2 className="px-4 pt-4">ETF Gains</h2>
                                                                                        <ETFDBTable records={formatted_etf_gains} clientBrokerDetails={clientBrokerDetails} />
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            return (<div className={`card-body border-0 p-0 ${currentAllTradeDataTab == 'alldatatab_'+wke.formattedEnd ? '' : 'd-none'}`}>No data found</div>)
                                                                        })}
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
            </main>
        </ApplicationLayout>
    </>
    )
}