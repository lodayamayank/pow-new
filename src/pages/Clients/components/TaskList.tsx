import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { PaginationState, pagination_items_per_page } from "@/utils";
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { deleteClientTask, deleteClientTaskAll, getClientTasks, setupClientTasks } from "../core/_requests";
import { AxiosError } from "axios";
import moment from "moment";
import { ClientTasksForList } from "../core/_models";
import { AlertMessage } from "@/components";

type Props = {
    children?: React.ReactNode
    clientId: string
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function TaskList(props: Props) {
    const { children, clientId = undefined } = props
    const [records, setRecords] = useState<any>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [paginationPayload, setPaginationPayload] = useState<PaginationState>({})
    const [search, setSerach] = useState<string>()
    const [page, setPage] = useState<number>()
    const [items_per_page, setitemsPerPage] = useState<number>(pagination_items_per_page)
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')
    const [initTaskDate, setInitTaskDate] = useState<string>('')
    const [initTaskEndDate, setInitTaskEndDate] = useState<string>('')
    const [selectedTask, setSelectedTask] = useState<string>('all')
    const [selectedTaskClient, setSelectedTaskClient] = useState<string>(clientId)

    async function loadRecords() {
        try {
            setIsLoading(true)
            const response = await getClientTasks(clientId)
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

    const deleteRecordLocal = async (uuid:number) => {
        try{
            setIsLoading(true)
            const resp = await deleteClientTask(clientId,uuid)
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
            <div className="d-flex">
                <div className="text-secondary">
                    Search:
                    <div className="ms-2 d-inline-block">
                    <input type="text" className="form-control" aria-label="Search invoice" />
                    </div>
                </div>
                <div className="ms-auto text-secondary d-flex">
                <CanAccess permissions={['update_clients']}>
                    <select className="form-select mx-2 p-1 d-inline w-auto" aria-label="Select task" onChange={e => setSelectedTask(e.target.value)}>
                        <option value="all">All</option>
                        {
                            Object.keys(ClientTasksForList).map((key) => {
                                return <option key={key} value={key}>{ClientTasksForList[key]}</option>
                            })
                        }
                    </select>
                    <select className="form-select mx-2 p-1 d-inline w-auto" aria-label="Select client" onChange={e => setSelectedTaskClient(e.target.value)}>
                        <option value="all">All Clients</option>
                        <option value={clientId} selected={true}>Current Client</option>
                    </select>
                    <input type="date" className="mx-2 p-1 form-control" onChange={e => setInitTaskDate(e.target.value)} />
                    <input type="date" className="mx-2 p-1 form-control" onChange={e => setInitTaskEndDate(e.target.value)} />
                    <button 
                    type='button' 
                    onClick={async () => {
                        try{
                            const respTask = await setupClientTasks(selectedTaskClient, selectedTask, initTaskDate, initTaskEndDate)
                            loadRecords()
                        }catch(e){
                            setFormSubmitMsgType('error')
                            setFormSubmitMsg(e.response.data.message)
                        }
                    }}
                    className="btn btn-md btn-outline-primary d-none d-sm-inline-block">
                    Initiate Tasks
                    </button>
                    <CanAccess permissions={['update_clients']}>
                        <button 
                        type='button' 
                        onClick={async () => {
                            try{
                                const respTaskDelete = await deleteClientTaskAll()
                                loadRecords()
                            }catch(e){
                                setFormSubmitMsgType('error')
                                setFormSubmitMsg(e.response.data.message)
                            }
                        }}
                        className="ms-2 btn btn-outline-danger d-none d-sm-inline-block">
                        Delete all tasks
                        </button>
                    </CanAccess>
                </CanAccess>
                </div>
            </div>
        </div>
        <div className="table-responsive">
            {formSubmitMsg && (<AlertMessage setFormSubmitMsg={setFormSubmitMsg} alertType={formSubmitMsgType} alertMessage={formSubmitMsg} />)}
            <table className="table table-vcenter card-table">
                <thead>
                    <tr>
                        <th>Task For</th>
                        <th>Scheduled Date</th>
                        <th>Attempted</th>
                        <th>Task Data</th>
                        <th className="w-25"></th>
                    </tr>
                </thead>
                <tbody>
                    {records && records.map((record) => (
                        <tr key={record.uuid}>
                            <td className=" text-nowrap">{record.taskDescription}</td>
                            <td>{moment(record.scheduledDate).format("DD/MM/YYYY")}</td>
                            <td>
                                {record.attempted ? (
                                    <div><span className="badge bg-success me-1"></span> Attempted</div> 
                                ) : (
                                <div><span className="badge bg-danger me-1"></span> Not Attempted</div>
                                )}
                            </td>
                            <td>{JSON.stringify(record.taskData)}</td>
                            <td className="text-end text-nowrap">
                                <CanAccess permissions={['delete_clients']}>
                                    <button type='button'
                                    className='ms-2 btn border-0 text-danger p-0'
                                    onClick={() => deleteRecordLocal(record.id)}
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