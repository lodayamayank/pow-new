import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { User } from './core/_models'
import { deleteRecord, getUsers } from './core/_requests'
import moment from 'moment'
import { ApplicationLayout, Breadcrumbs, CanAccess, NoRecordsFoundMessage, PageHeading, Pagination } from '@/components'
import { PaginationState, pagination_items_per_page } from '@/utils'
import { stringifyRequestQuery } from '@/utils/libs/crud-helper'
import { useRoutePaths } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paginationPayload, setPaginationPayload] = useState<PaginationState>({})
  const [search, setSerach] = useState<string>()
  const [page, setPage] = useState<number>()
  const [items_per_page, setitemsPerPage] = useState<number>(pagination_items_per_page)
  const { USERS_PATH, USERS_CREATE_PATH } = useRoutePaths()
  const navigate = useNavigate()
  async function loadUsers() {
    try {
      setIsLoading(true)
      const response = await getUsers(stringifyRequestQuery({search,page,items_per_page}))
      console.log("response",response)
      const pagination = response?.payload?.pagination || {};
      const userList = response?.data || [];
      console.log("userList",userList)
      setUsers(userList)
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
    {/* <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Users</h1>
      </div>
    </header> */}
    <ApplicationLayout>
      {/* <PageHeading>
        <h2 className="page-title">Users</h2>
        <Breadcrumbs links={[{title: 'Users', path: USERS_PATH, isActive: true}]} />
      </PageHeading> */}
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
                          <h3 className="card-title">Users</h3>
                          <div className="card-actions">
                              <CanAccess permissions={['add_users']}>
                                <button 
                                type='button' 
                                onClick={() => navigate(USERS_CREATE_PATH)}
                                className="btn btn-outline-primary d-none d-sm-inline-block">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                  Create new user
                                </button>
                                <button
                                type='button' 
                                onClick={() => navigate(USERS_CREATE_PATH)}
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
                                id="table-search-users"
                                onChange={(e) => setSerach(e.target.value)}
                                className="form-control" 
                                placeholder="Search for users" />  
                            </div>
                            <div className="ms-auto text-muted">
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive">
                          {users.length == 0 && (
                            <NoRecordsFoundMessage actionUrl={USERS_CREATE_PATH} actionLabel='Create new user' heading='No users found' subHeading='create a new user to get started' />
                          )}
                          <table className="table card-table table-vcenter text-nowrap datatable">
                            <thead>
                              <tr>
                                {/* <th className="w-1">No. 
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-sm icon-thick" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15l6 -6l6 6" /></svg>
                                </th> */}
                                <th>User Details</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {!isLoading && users?.length > 0 ? (
                                  users.map((user) => (
                                <tr>
                                  <td>
                                    <div className="d-flex py-1 align-items-center">
                                      <span className="avatar me-2">{user.full_name[0]}</span>
                                      <div className="flex-fill">
                                        <div className="font-weight-medium">{user.full_name}</div>
                                        <div className="text-secondary"><span className="text-reset">{user.email}</span></div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{user.roles && user.roles.length > 0 ? (<span className='badge badge-outline text-blue'>{user.roles[0].name}</span>) : 'N/A'}</span>
                                  </td>
                                  <td>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{user.persistable ? moment(user.persistable?.created_at).format("D MMM YYYY, h:mma") : ''}</span>
                                  </td>
                                  <td>
                                    {user.is_active ? (
                                      <div><span className="badge bg-success me-1"></span> Active</div> 
                                    ) : (
                                    <div><span className="badge bg-danger me-1"></span> Inactive</div>
                                    )}
                                  </td>
                                  <td className="text-end">
                                    <CanAccess permissions={['update_users']}>
                                      <button type='button'
                                      className='btn btn-icon btn-outline-primary'
                                      onClick={() => navigate(`/users/update/${user.uuid}`)}
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                          <path d="M16 5l3 3" />
                                        </svg>
                                      </button>
                                    </CanAccess>
                                    {user.id !== 1 && (
                                      <>
                                      <CanAccess permissions={['delete_users']}>
                                        <button type='button'
                                        className='ms-2 btn btn-icon btn-outline-danger'
                                        onClick={() => deleteRecordLocal(user.uuid)}
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
                                      </>
                                    )}
                                  {/* <span className="dropdown">
                                    <NavDropdown
                                    className='justify-content-end hide-dropdown-arrow' title={(<button className="btn dropdown-toggle align-text-top">Actions</button>)} id="basic-nav-dropdown">
                                      <CanAccess permissions={['update_users']}>
                                        <NavDropdown.Item href={`/users/update/${user.uuid}`}>Update</NavDropdown.Item>
                                      </CanAccess>
                                      <CanAccess permissions={['delete_users']}>
                                        <NavDropdown.Item onClick={() => deleteRecordLocal(user.uuid)}>Delete</NavDropdown.Item>
                                      </CanAccess>
                                    </NavDropdown>
                                  </span> */}
                                  </td>
                                </tr>
                              ))) : (<></>) }
                            </tbody>
                          </table>
                        </div>
                        <div className="card-footer d-flex align-items-center">
                          <Pagination payload={paginationPayload} isLoading={isLoading} loadPage={setPage} />
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

export default Users
