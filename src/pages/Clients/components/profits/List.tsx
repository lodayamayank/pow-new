import { CanAccess } from "@/components/CanAccess"
import React, { useEffect, useState } from "react";
import { ClientProfitSettled } from "../../core/_models";
import { PaginationState, pagination_items_per_page } from "@/utils";
import { deleteClientProfitsRecord, getClientProfitsRecords} from "../../core/_requests";
import { stringifyRequestQuery } from "@/utils/libs/crud-helper";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import moment from "moment";

type Props = {
    children?: React.ReactNode
    clientId: string
    currentAction: string
    setCurrentAction: any
    setCurrentRecordId: any
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function List(props: Props) {
    const { id: clientId  } = useParams()
    const { children, setCurrentAction, setCurrentRecordId } = props
    const [records, setRecords] = useState<ClientProfitSettled[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [paginationPayload, setPaginationPayload] = useState<PaginationState>({})
    const [search, setSerach] = useState<string>()
    const [page, setPage] = useState<number>()
    const [items_per_page, setitemsPerPage] = useState<number>(pagination_items_per_page)

    async function loadRecords() {
        try {
            setIsLoading(true)
            const response = await getClientProfitsRecords(clientId,stringifyRequestQuery({search,page,items_per_page}))
            const pagination = response?.payload?.pagination || {};
            const recordsList = response?.data || [];
            setRecords(recordsList)
            setPaginationPayload(pagination)
            setIsLoading(false)
        } catch (error) {
            const err = error as AxiosError
            setIsLoading(false)
            return err
        }
    }

    const deleteRecordLocal = async (uuid:string) => {
        try{
            setIsLoading(true)
            const resp = await deleteClientProfitsRecord(clientId,uuid)
            setCurrentAction('list')
            setIsLoading(false)
            loadRecords()
        } catch (error) {
            const err = error as AxiosError
            setIsLoading(false)
            return err
        }
    }
    useEffect(() => {
        loadRecords()
    }, ['clientId','search'])

    return (
    <>
        <div className="border-bottom py-3">
            <div className="d-flex px-4">
                <div className="text-secondary">
                    Search:
                    <div className="ms-2 d-inline-block">
                    <input type="text" onChange={(e) => setSerach(e.target.value)} className="form-control form-control-sm" aria-label="Search invoice" />
                    </div>
                </div>
                <div className="ms-auto text-secondary">
                <CanAccess permissions={['add_clients_aum']}>
                    <button 
                    type='button' 
                    onClick={() => setCurrentAction('add')}
                    className="btn btn-outline-primary d-none d-sm-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                    Add
                    </button>
                    <button
                    type='button' 
                    onClick={() => setCurrentAction('add')}
                    className="btn btn-outline-primary d-sm-none btn-icon" aria-label="Create new">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                    </button>
                </CanAccess>
                </div>
            </div>
        </div>
        <div className="table-responsive">
            <table className="table table-vcenter card-table">
                <thead>
                    <tr>
                        <th>Broker</th>
                        <th>Amount</th>
                        <th>Settled Date</th>
                        <th className="w-25"></th>
                    </tr>
                </thead>
                <tbody>
                    {records && records.map((record) => (
                        <tr key={record.uuid}>
                            <td className=" text-nowrap">{record.broker.name}</td>
                            <td>{record.amount}</td>
                            <td>{moment(record.settledDate).format("DD/MM/YYYY")}</td>
                            <td className="text-end text-nowrap">
                                <CanAccess permissions={['update_clients_profits_settled']}>
                                    <button type='button'
                                    className='btn border-0 text-primary p-0'
                                    onClick={() => {
                                        setCurrentRecordId(record.uuid)
                                        setCurrentAction("update")
                                    }}
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                        <path d="M16 5l3 3" />
                                    </svg>
                                    </button>
                                </CanAccess>
                                <CanAccess permissions={['delete_clients_profits_settled']}>
                                    <button type='button'
                                    className='ms-2 btn border-0 text-danger p-0'
                                    onClick={() => deleteRecordLocal(record.uuid)}
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 7l16 0" />
                                        <path d="M10 11l0 6" />
                                        <path d="M14 11l0 6" />
                                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                    </svg>
                                    </button>
                                </CanAccess>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
    )
}