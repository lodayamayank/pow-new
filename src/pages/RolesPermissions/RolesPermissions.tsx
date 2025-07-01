import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { Permission, Role } from './core/_models'
import { getPermissionsList, getRolesList } from './core/_requests'
import { ApplicationLayout, Breadcrumbs, CanAccess, PageHeading } from '@/components'
import { useRoutePaths } from '@/hooks'
import RoleAccordion from './RolesAccordion'
import { Accordion } from 'flowbite-react';
import { useNavigate } from 'react-router-dom'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { USERS_PATH, USERS_CREATE_PATH } = useRoutePaths()
  const navigate = useNavigate()
  async function loadRoles() {
    try {
      setIsLoading(true)
      const response = await getRolesList()
      const rolesList = response || [];
      // @ts-ignore
      setRoles(rolesList)
      setIsLoading(false)
    } catch (error) {
      const err = error as AxiosError
      setIsLoading(false)
      return err
    }
  }

  async function loadPermissions() {
    try {
      setIsLoading(true)
      const response = await getPermissionsList()
      const permissionsList = response || [];
      // @ts-ignore
      setPermissions(permissionsList)
      setIsLoading(false)
    } catch (error) {
      const err = error as AxiosError
      setIsLoading(false)
      return err
    }
  }

  const breadCrumbs = [
    {title: 'Users', path: USERS_PATH, isActive: false},
    {title: 'Roles & Permissions', path: USERS_PATH, isActive: true}
  ]

  useEffect(() => {
    loadRoles()
    loadPermissions()
  }, [])

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
                          <h3 className="card-title">Roles and Permissions</h3>
                          <div className="card-actions">
                              <CanAccess permissions={['add_roles']}>
                                <button 
                                type='button' 
                                onClick={() => navigate(USERS_CREATE_PATH)}
                                className="btn btn-outline-primary d-none d-sm-inline-block">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                  Add new role
                                </button>
                              </CanAccess>
                          </div>
                        </div>
                        <div className="card-body border-bottom py-3">
                          {roles.length > 0 && (
                            roles.map((role:Role) => (
                              <RoleAccordion role={role} permissions={permissions} />
                            ))
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
      </main>
      </ApplicationLayout>
    </>
  )
}

export default RolesPermissions
