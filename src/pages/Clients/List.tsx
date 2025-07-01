import { AxiosError } from 'axios'
import { useEffect, useState, Fragment, useRef } from 'react'
import { Client } from './core/_models'
import { deleteRecord, getRecords, uploadClientAdjustmentsRecord } from './core/_requests'
import moment from 'moment'
import { AlertMessage, ApplicationLayout, Breadcrumbs, CanAccess, NoRecordsFoundMessage, PageHeading, Pagination } from '@/components'
import { PaginationState, pagination_items_per_page } from '@/utils'
import { stringifyRequestQuery } from '@/utils/libs/crud-helper'
import { useRoutePaths } from '@/hooks'
import { useNavigate } from 'react-router-dom'


function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function List() {
  const [records, setRecords] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paginationPayload, setPaginationPayload] = useState<PaginationState>({})
  const [search, setSerach] = useState<string>()
  const [page, setPage] = useState<number>()
  const [items_per_page, setitemsPerPage] = useState<number>(pagination_items_per_page)
  const { CLIENTS_PATH, CLIENTS_CREATE_PATH } = useRoutePaths()
  const navigate = useNavigate()
  const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
  const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')
  async function loadRecords() {
    try {
      setIsLoading(true)
      const response = await getRecords(stringifyRequestQuery({search,page,items_per_page}))
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
      const resp = await deleteRecord(uuid)
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
  }, [search, page])

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
                      {formSubmitMsg && (<AlertMessage setFormSubmitMsg={setFormSubmitMsg} alertType={formSubmitMsgType} alertMessage={formSubmitMsg} />)}
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Clients</h3>
                            <div className="card-actions">
                              <CanAccess permissions={['add_clients']}>
                                <button 
                                type='button' 
                                onClick={() => navigate(CLIENTS_CREATE_PATH)}
                                className="btn btn-outline-primary d-none d-sm-inline-block">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                  Create new client
                                </button>
                                <button
                                type='button' 
                                onClick={() => navigate(CLIENTS_CREATE_PATH)}
                                className="btn btn-outline-primary d-sm-none btn-icon" aria-label="Create new">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                </button>
                              </CanAccess>
                            </div>
                        </div>

                        <div className="card-body border-bottom py-3">
                          <div className="d-flex">
                            <div className="text-muted">
                              <input 
                                type="text" 
                                id="table-search-records"
                                onChange={(e) => setSerach(e.target.value)}
                                defaultValue={search}
                                className="form-control" 
                                placeholder="Search for records" />  
                            </div>
                            <button type='button' className='btn ms-2' onClick={() => setSerach(null)}>Reset</button>
                            <div className="ms-auto text-muted">
                              
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive">
                          {records.length == 0 ? (
                            <NoRecordsFoundMessage actionUrl={CLIENTS_CREATE_PATH} actionLabel='Create new record' heading='No records found' subHeading='create a new record to get started' />
                          ):(
                          <table className="table card-table table-vcenter text-nowrap datatable">
                            <thead>
                              <tr>
                                <th>Personal Details</th>
                                <th>PAN</th>
                                <th>DOB</th>
                                {/* <th>Nominee</th> */}
                                <th>Weekly Report</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {!isLoading && records?.length > 0 ? (
                                  records.map((record) => (
                                <tr>
                                  <td className='cursor-pointer hover:text-primary' onClick={() => navigate('/clients/details/'+record.uuid)}>
                                    <div className="d-flex py-1 align-items-center">
                                      <span className="avatar me-2">{record.name[0]}</span>
                                      <div className="flex-fill">
                                        <div className="font-weight-medium text-blue">{record.name} ({record.nickname})</div>
                                        <div className="text-secondary text-blue"><span className="text-reset">{record.mobile}, {record.email}</span></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{record.pan}</td>
                                  <td>{moment(record.dob).format("DD-MM-YYYY")}</td>
                                  {/* <td>{record.nomineeName}</td> */}
                                  <td>
                                    {record.weeklyReport ? (
                                      <div><span className="badge bg-success me-1"></span> Yes</div> 
                                    ) : (
                                    <div><span className="badge bg-danger me-1"></span> No</div>
                                    )}
                                  </td>
                                  <td>
                                    {record.is_active ? (
                                      <div><span className="badge bg-success me-1"></span> Active</div> 
                                    ) : (
                                    <div><span className="badge bg-danger me-1"></span> Inactive</div>
                                    )}
                                  </td>
                                  <td>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{record.persistable ? moment(record.persistable?.created_at).format("D MMM YYYY, h:mma") : ''}</span>
                                  </td>
                                  <td className="text-end">
                                    <CanAccess permissions={['update_clients']}>
                                      <button type='button'
                                      className='btn btn-icon btn-outline-primary'
                                      onClick={() => navigate(`/clients/update/${record.uuid}`)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                          <path d="M16 5l3 3" />
                                        </svg>
                                      </button>
                                    </CanAccess>
                                    <CanAccess permissions={['delete_clients']}>
                                      <button type='button'
                                      className='ms-2 btn btn-icon btn-outline-danger'
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
                              ))) : (<></>) }
                            </tbody>
                          </table>
                          )}
                        </div>
                        {records.length > 0 && (
                        <div className="card-footer d-flex align-items-center">
                          <Pagination payload={paginationPayload} isLoading={isLoading} loadPage={setPage} />
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
      </main>
    </ApplicationLayout>
    </>
  )
}

export default List
