import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Integration } from './core/_models'
import { INTEGRATIONS_URL, deleteRecord, getRecords } from './core/_requests'
import moment from 'moment'
import { Breadcrumbs, CanAccess, Loader, NoRecordsFoundMessage, Pagination, S3Image } from '@/components'
import { PaginationState, pagination_items_per_page } from '@/utils'
import { stringifyRequestQuery } from '@/utils/libs/crud-helper'
import { useRoutePaths } from '@/hooks'


function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function Integrations() {
  const [records, setRecords] = useState<Integration[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paginationPayload, setPaginationPayload] = useState<PaginationState>({})
  const [search, setSerach] = useState<string>()
  const [page, setPage] = useState<number>()
  const [items_per_page, setitemsPerPage] = useState<number>(pagination_items_per_page)
  const { INTEGRATIONS_PATH, INTEGRATIONS_CREATE_PATH } = useRoutePaths()
  async function loadRecords() {
    try {
      setIsLoading(true)
      const response = await getRecords(stringifyRequestQuery({search,page,items_per_page}))
      // @ts-ignore
      const pagination = response?.payload?.pagination || {};
      // @ts-ignore
      const recordList = response?.data || [];
      setRecords(recordList)
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
    {/* <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Users</h1>
      </div>
    </header> */}
    <main>

      <div className="max-w-[80rem] p-8 mx-auto">

        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1 min-w-full inline-block align-middle">
              <div className="bg-white shadow border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      Integrations
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <Breadcrumbs links={[{title: 'Integrations', path: INTEGRATIONS_PATH, isActive: true}]} />
                    </p>
                  </div>

                  <div>
                    <div className="inline-flex gap-x-2">
                      <div className='inline-flex items-center gap-x-2'>
                        <input 
                        type="text" 
                        id="table-search-users"
                        onChange={(e) => setSerach(e.target.value)}
                        className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        placeholder="Search..." />  
                      </div>
                      <CanAccess permissions={['add_integrations']}>
                        <a href={INTEGRATIONS_CREATE_PATH} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                          <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                          Create
                        </a>
                      </CanAccess>
                    </div>
                  </div>
                </div>
                {isLoading && (
                  <Loader />
                )}
                {!isLoading && records.length == 0 && (
                  <NoRecordsFoundMessage actionUrl={INTEGRATIONS_CREATE_PATH} actionLabel='Create new record' heading='No records found' subHeading='create a new record to get started' />
                )}
                
                {records.length > 0 && (
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                      <tr>
        
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Name
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Description
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2  whitespace-nowrap">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Default Active?
                            </span>
                          </div>
                        </th>
        
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2  whitespace-nowrap">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Is Active?
                            </span>
                          </div>
                        </th>
        
                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2  whitespace-nowrap">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                              Created At
                            </span>
                          </div>
                        </th>
        
                        <th scope="col" className="px-6 py-3 text-end"></th>
                      </tr>
                    </thead>
        
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {!isLoading && records?.length > 0 ? (
                      records.map((record) => (
                      <tr className="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                        <td className="h-px w-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                            <div className="flex items-center gap-x-3 ps-6">
                              {record.svg_icon && record.svg_icon !== "" ? (
                                <span className="inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-gray-300 dark:bg-gray-700">
                                  <div className="content p-2" dangerouslySetInnerHTML={{__html: record.svg_icon}}></div>
                                </span>  
                              ) : record.image && record.image.fileKey ? (
                                <S3Image objectKey={record.image.fileKey} classes='inline-block h-[2.375rem] w-[2.375rem] rounded-full' />
                              ) : (
                                <span className="inline-flex items-center justify-center h-[2.375rem] w-[2.375rem] rounded-full bg-gray-300 dark:bg-gray-700">
                                  <span className="font-medium text-gray-800 leading-none dark:text-gray-200">{record.name ? record.name[0].toUpperCase() : 'S'}</span>
                                </span>
                              )}
                              <div className="grow">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">{record.name}</span>
                                <span className="block text-sm text-gray-500">{record.code}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-px">
                          <div className="px-6 py-2 truncate w-48">
                            {record.description}
                          </div>
                        </td>
                        <td className="h-px w-px whitespace-nowrap">
                          <div className="px-6 py-2">
                            { record.default_active ? (
                              <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                </svg>
                                Yes
                              </span>
                            ) : (
                              <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                                <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                No
                              </span>
                            )}
                            
                          </div>
                        </td>
                        <td className="h-px w-px whitespace-nowrap">
                          <div className="px-6 py-2">
                            { record.is_active ? (
                              <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                </svg>
                                Active
                              </span>
                            ) : (
                              <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                                <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                Inactive
                              </span>
                            )}
                            
                          </div>
                        </td>
                        <td className="h-px w-px whitespace-nowrap">
                          <div className="px-6 py-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{record.persistable ? moment(record.persistable?.created_at).format("D MMM YYYY, h:mma") : ''}</span>
                          </div>
                        </td>
                        <td className="h-px w-px whitespace-nowrap">
                          <Menu as="div" className="relative inline-block text-left">
                            <div>
                              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                Actions
                              </Menu.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <CanAccess permissions={['update_integrations']}>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <a
                                          href={`/integrations/update/${record.uuid}`}
                                          className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                          )}
                                        >
                                          Edit
                                        </a>
                                      )}
                                    </Menu.Item>
                                  </CanAccess>
                                  <CanAccess permissions={['delete_integrations']}>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <a
                                        onClick={() => deleteRecordLocal(record.uuid)}
                                        className={classNames(
                                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                          'block px-4 py-2 text-sm cursor-pointer'
                                        )}
                                      >
                                        Delete
                                      </a>
                                    )}
                                  </Menu.Item>
                                  </CanAccess>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </td>
                      </tr>
                    ))) : (<></>)}

                    </tbody>
                  </table>
                )}
                <Pagination payload={paginationPayload} isLoading={isLoading} loadPage={setPage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}

export default Integrations