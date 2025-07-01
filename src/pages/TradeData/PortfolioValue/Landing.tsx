import { ApplicationLayout } from "@/components";
import { CanAccess } from "@/components/CanAccess"
import { Client } from "@/pages/Clients/core/_models";
import { getClientBrokerRecords, getRecords as getClientsRecords } from "@/pages/Clients/core/_requests";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { PortfolioValueTable } from "./PortfolioValueTable";
import moment from "moment";
import { formatPortfolioValueResponseData, getTradeData } from "../core/_requests";
import { PortfolioValueDBTable } from "./PortfolioValueDBTable";

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
    const [startDate, setStartDate] = useState<string>(moment().format("YYYY-MM-DD"))
    const [endDate, setEndDate] = useState<string>(moment().format("YYYY-MM-DD"))
    const [currentBrokerTab, setCurrentBrokerTab] = useState<string>('angel')
    const [angelRecords, setAngelRecords] = useState<any>([])
    const [iiflRecords, setIIFLRecords] = useState<any>([])
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

    async function loadTradeData() {
        setIIFLRecords([])
        setAngelRecords([])
        const clientBrokersResponse = await getClientBrokerRecords(clientId);
        const clientBrokers = clientBrokersResponse?.data || [];
        clientBrokers.map(async (clientBroker) => {
            let reqData = {
                "data_type": "portfolio_value", //ledger, fno_profits, portfolio_value
                "daterange": `${startDate}`,
                "client_code": clientBroker.clientCode
            }
            if(currentBrokerTab == "angel" && clientBroker.broker.code == "angle-one-broking"){
                setAngelLoading(true)
                try{
                    const angelResponse = await getTradeData('angel',reqData)
                    if(angelResponse.status == 201){
                        // const data = JSON.parse(angelResponse.data.data)
                        // const finalDataJson = data.data.data
                        // const finalData = formatPortfolioValueResponseData("angel",finalDataJson,startDate)
                        const finalData = angelResponse.data
                        setAngelRecords(finalData)
                    }
                }catch(e){
                    console.log("angel error", e)
                }
                setAngelLoading(false)
            }
            if(currentBrokerTab == "iifl" && clientBroker.broker.code == "iifl-securities"){
                setIIFLoading(true)
                try{
                    reqData.client_code = clientBroker.boidDematNumber
                    const startDateSplit = startDate.split("-")
                    reqData.daterange = startDateSplit[2]+"/"+startDateSplit[1]+"/"+startDateSplit[0]
                    const iiflResponse = await getTradeData('iifl',reqData)
                    if(iiflResponse.status == 201){
                        // const finalData = formatPortfolioValueResponseData("iifl", iiflResponse, startDate)
                        const finalData = iiflResponse.data
                        setIIFLRecords(finalData)
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
                                                    <h3 className="card-title">Client Portfolio Value</h3>
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
                                                        <input type="date" className="form-control me-2 d-none" placeholder="YYYY-MM-DD"
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
                                                                <PortfolioValueDBTable records={angelRecords} />
                                                            </div>    
                                                        )}
                                                        {currentBrokerTab == "iifl" && (
                                                            <div className="card-body p-0">
                                                                <PortfolioValueDBTable records={iiflRecords} />
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