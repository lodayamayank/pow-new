import { ApplicationLayout } from "@/components";
import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { Client } from "@/pages/Clients/core/_models";
import { getClientBrokerRecords, getRecords as getClientsRecords } from "@/pages/Clients/core/_requests";
import { AxiosError } from "axios";
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { LedgerTable } from "./LedgerTable";
import moment from "moment";
import { formatLedgerResponseData, getTradeData } from "../core/_requests";
import { flattenArray } from "@/utils";

type Props = {
    children?: React.ReactNode
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Landing(props: Props) {
    const { children } = props
    const [isAngelLoading, setAngelLoading] = useState<boolean>(false)
    const [isIIFLLoading, setIIFLoading] = useState<boolean>(false)
    const [clients, setClients] = useState<Client[]>([])
    const [clientId, setClientId] = useState<string>()
    const [startDate, setStartDate] = useState<string>(moment().subtract(7,'days').format("YYYY-MM-DD"))
    const [endDate, setEndDate] = useState<string>(moment().format("YYYY-MM-DD"))
    const [currentBrokerTab, setCurrentBrokerTab] = useState<string>('angel')
    const [angelLedgerRecords, setAngelLedgerRecords] = useState<any>([])
    const [iiflLedgerRecords, setIIFLLedgerRecords] = useState<any>([])
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

    const powCategories = [
        {
            "category_label": "DP Charges",
            "angel_search_text": ["DP Charges"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Pledge/Unpledge charges",
            "angel_search_text": ["Pledge/Unpledge charges"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Trades Executed",
            "angel_search_text": ["Trades Executed"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Funds Withdrawn",
            "angel_search_text": ["Funds Withdrawn"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Account Maintenance charge",
            "angel_search_text": ["Account Maintenance charge"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Quarterly Settlement",
            "angel_search_text": ["Quarterly Settlement"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Funds Added",
            "angel_search_text": ["Funds Added"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Interest Charges",
            "angel_search_text": ["Interest Charges"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Reversal DP Charges",
            "angel_search_text": ["Reversal DP Charges"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "CUSA Sell Off Charges",
            "angel_search_text": ["CUSA Sell Off Charges"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "CHARGES FOR SELLING/TRANSFER OF SHARES",
            "angel_search_text": ["CHARGES FOR SELLING/TRANSFER OF SHARES FROM YOUR DEMAT A/C DT"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "BEING AMT TRF FROM NSE TO MCX",
            "angel_search_text": ["BEING AMT TRF FROM NSE TO MCX"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "BEING AMT TRF FROM NSE TO MCX",
            "angel_search_text": ["BEING AMT TRF FROM NSE TO MCX"],
            "iifl_search_text": ["none"]
        },
        {
            "category_label": "Misc Charges",
            "angel_search_text": ["none"],
            "iifl_search_text": ["BEING INTEREST ON DELAYED PAYMENT","CDSL DP Bill","BEING INTEREST ON DELAYED PAYMENT","Being debited Investor Protection Fund Trust"]
        },
        {
            "category_label": "Cash Transcation",
            "angel_search_text": ["none"],
            "iifl_search_text": ["BILL FOR NM"]
        },
        {
            "category_label": "Funds",
            "angel_search_text": ["none"],
            "iifl_search_text": ["BEING FUND RECD","BEING PAYOUT RELEASED BY IIFL",""]
        },
        {
            "category_label": "Ignore",
            "angel_search_text": [],
            "iifl_search_text": []
        },
        {
            "category_label": "FNO Transcation",
            "angel_search_text": ["none"],
            "iifl_search_text": ["FO BILL FOR"]
        }
    ]

    const mapPOWCategory = (particulars: string, forBroker: string) => {
        const foundItem = powCategories.find((catItem) => forBroker == "angel" ? catItem.angel_search_text.find((srcText) => particulars.includes(srcText)) : catItem.iifl_search_text.find((srcText1) => {
            // console.log(particulars,srcText1)
            return particulars.includes(srcText1)}
        ))
        // console.log("foundItem",foundItem);
        if(foundItem && "category_label" in foundItem){
            return foundItem["category_label"]
        }
        return "Ignore from storing"
    }

    async function loadTradeData() {
        setIIFLLedgerRecords([])
        setAngelLedgerRecords([])
        const clientBrokersResponse = await getClientBrokerRecords(clientId);
        const clientBrokers = clientBrokersResponse?.data || [];
        clientBrokers.map(async (clientBroker) => {
            const reqData = {
                "data_type": "ledger", //ledger, transaction, pnl
                "daterange": `${startDate},${endDate}`,
                "client_code": clientBroker.clientCode
            }
            if(currentBrokerTab == "angel" && clientBroker.broker.code == "angle-one-broking"){
                setAngelLoading(true)
                try{
                    const angelResponse = await getTradeData('angel',reqData)
                    console.log("angelResponse",angelResponse)
                    if(angelResponse.status == 201){
                        // const angelResponseData = flattenArray(angelResponse.data.data)
                        // const formattedFinalData = formatLedgerResponseData("angel", angelResponseData)
                        const formattedFinalData = angelResponse.data
                        setAngelLedgerRecords(formattedFinalData);
                    }
                }catch(e){
                    console.log("angle error", e)
                }
                setAngelLoading(false)
            }
            if(currentBrokerTab == "iifl" && clientBroker.broker.code == "iifl-securities"){
                setIIFLoading(true)
                try{
                    const iiflResponse = await getTradeData('iifl',reqData)
                    console.log("iiflResponse",iiflResponse)
                    if(iiflResponse.status == 201){
                        // const formattedFinalData = formatLedgerResponseData("iifl", iiflResponse)
                        const formattedFinalData = iiflResponse.data
                        setIIFLLedgerRecords(formattedFinalData);
                    }
                }catch(e){
                    console.log("iifl error", e)
                }
                setIIFLoading(false)
            }
        });
    }

    useEffect(() => {
        loadClients()   
    },[])


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
                                                    <h3 className="card-title">Client Ledger</h3>
                                                    <div className="card-actions">
                                                    </div>
                                                </div>
                                                <div className="card-body border-0 py-3">
                                                    <div className="d-flex">
                                                        <select 
                                                        className="form-control form-select me-2"
                                                        onChange={(e) => setClientId(e.target.value)}
                                                        >
                                                            <option value="">Select Client</option>
                                                            {clients && clients.map((client) => (
                                                                <option value={client.uuid} key={client.uuid}>{client.name}</option>
                                                            ))}
                                                        </select>
                                                        <select 
                                                        className="form-control form-select me-2"
                                                        onChange={(e) => setCurrentBrokerTab(e.target.value)}
                                                        defaultValue={currentBrokerTab}
                                                        >
                                                            <option value="">Select Broker</option>
                                                            <option value="angel">Angel Broking</option>
                                                            <option value="iifl">IIFL Broking</option>
                                                        </select>
                                                        <input type="date" className="form-control me-2" placeholder="YYYY-MM-DD"
                                                        defaultValue={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        />
                                                        <input type="date" className="form-control me-2" placeholder="YYYY-MM-DD"
                                                        defaultValue={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        />
                                                        <button type="button" className="btn btn-primary"
                                                        disabled={isAngelLoading || isIIFLLoading}
                                                        onClick={() => loadTradeData()}
                                                        >{isAngelLoading || isIIFLLoading ? 'Loading...' : 'Submit'}</button>
                                                    </div>
                                                </div>
                                                <div className="card-body p-0">
                                                    <div className="card">
                                                        <div className="card-header">
                                                            <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs" role="tablist">
                                                                <li 
                                                                className="nav-item cursor-pointer" 
                                                                role="presentation"
                                                                onClick={() => setCurrentBrokerTab('angel')}
                                                                >
                                                                    <span className={`nav-link ${currentBrokerTab == "angel" ? 'active' : ''}`} role="tab">Angel One</span>
                                                                </li>
                                                                <li 
                                                                className="nav-item cursor-pointer" 
                                                                role="presentation"
                                                                onClick={() => setCurrentBrokerTab('iifl')}
                                                                >
                                                                    <span className={`nav-link ${currentBrokerTab == "iifl" ? 'active' : ''}`} role="tab">IIFL</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        {currentBrokerTab == "angel" && (
                                                            <div className="card-body p-0">
                                                                <LedgerTable ledgerRecords={angelLedgerRecords} />
                                                            </div>    
                                                        )}
                                                        {currentBrokerTab == "iifl" && (
                                                            <div className="card-body p-0">
                                                                <LedgerTable ledgerRecords={iiflLedgerRecords} />
                                                            </div>    
                                                        )}
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