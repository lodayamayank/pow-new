import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Broker } from './core/_models'
import { deleteRecord, getRecords } from './core/_requests'
import moment from 'moment'
import { ApplicationLayout, Breadcrumbs, CanAccess, NoRecordsFoundMessage, PageHeading, Pagination } from '@/components'
import { PaginationState, pagination_items_per_page } from '@/utils'
import { stringifyRequestQuery } from '@/utils/libs/crud-helper'
import { useRoutePaths } from '@/hooks'
import { useNavigate } from 'react-router-dom'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function List() {
  const [records, setRecords] = useState<Broker[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paginationPayload, setPaginationPayload] = useState<PaginationState>({})
  const [search, setSerach] = useState<string>()
  const [page, setPage] = useState<number>()
  const [items_per_page, setitemsPerPage] = useState<number>(pagination_items_per_page)
  const { MASTERDATA_BROKERS_PATH, MASTERDATA_BROKERS_CREATE_PATH } = useRoutePaths()
  const navigate = useNavigate()
  async function loadUsers() {
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
      loadUsers()
    } catch (error) {
      const err = error as AxiosError
      setIsLoading(false)
      return err
    }
  }

  useEffect(() => {
    loadUsers()
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
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Brokers</h3>
                          <div className="card-actions">
                              <CanAccess permissions={['add_masterdata_brokers']}>
                                <button 
                                type='button' 
                                onClick={() => navigate(MASTERDATA_BROKERS_CREATE_PATH)}
                                className="btn btn-outline-primary d-none d-sm-inline-block">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                  Create new broker
                                </button>
                                <button
                                type='button' 
                                onClick={() => navigate(MASTERDATA_BROKERS_CREATE_PATH)}
                                className="btn btn-outline-primary d-sm-none btn-icon" aria-label="Create new">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                </button>
                              </CanAccess>
                          </div>
                        </div>
                        {records.length > 0 && (
                        <div className="card-body border-bottom py-3">
                          <div className="d-flex">
                            <div className="text-muted">
                              <input 
                                type="text" 
                                id="table-search-records"
                                onChange={(e) => setSerach(e.target.value)}
                                className="form-control" 
                                placeholder="Search for records" />  
                            </div>
                            <div className="ms-auto text-muted">
                            </div>
                          </div>
                        </div>
                        )}
                        <div className="table-responsive">
                          {records.length == 0 ? (
                            <NoRecordsFoundMessage actionUrl={MASTERDATA_BROKERS_CREATE_PATH} actionLabel='Create new record' heading='No records found' subHeading='create a new record to get started' />
                          ):(
                          <table className="table card-table table-vcenter text-nowrap datatable">
                            <thead>
                              <tr>
                                <th>Broker Details</th>
                                <th>DP ID</th>
                                <th>ETF ISIN</th>
                                <th>ETF Script Codes</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {!isLoading && records?.length > 0 ? (
                                  records.map((record) => (
                                <tr>
                                  <td>
                                    <div className="d-flex py-1 align-items-center">
                                      <span className="avatar me-2">{record.name[0]}</span>
                                      <div className="flex-fill">
                                        <div className="font-weight-medium">{record.name}</div>
                                        <div className="text-secondary"><span className="text-reset">{record.code}</span></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{record.dpid}</td>
                                  <td>{record.etfs_isins}</td>
                                  <td>{record.etfs_scripcodes}</td>
                                  <td>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{record.persistable ? moment(record.persistable?.created_at).format("D MMM YYYY, h:mma") : ''}</span>
                                  </td>
                                  <td>
                                    {record.is_active ? (
                                      <div><span className="badge bg-success me-1"></span> Active</div> 
                                    ) : (
                                    <div><span className="badge bg-danger me-1"></span> Inactive</div>
                                    )}
                                  </td>
                                  <td className="text-end">
                                    <CanAccess permissions={['update_masterdata_brokers']}>
                                      <button type='button'
                                      className='btn btn-icon btn-outline-primary'
                                      onClick={() => navigate(`/masterdata/brokers/update/${record.uuid}`)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                          <path d="M16 5l3 3" />
                                        </svg>
                                      </button>
                                    </CanAccess>
                                    <CanAccess permissions={['delete_masterdata_brokers']}>
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
