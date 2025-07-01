import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { Permission, Role, User, initialUser, userDetailsInitValues as initialValues } from './core/_models'
import { getPermissionsList, getRolesList, getUsers, createRecord, getUserById, updateRecord } from './core/_requests'
import { CanAccess, Breadcrumbs, Loader, AlertMessage, ApplicationLayout } from '@/components'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const userDetailsSchema = Yup.object().shape({
    full_name: Yup.string().required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    mobile: Yup.number().required('Mobile is required'),
    roles: Yup.array().required('Select atleast one role')
})


function UpdateUser() {
    const { id } = useParams()
    const [data, setData] = useState<User>(initialValues)
    const [record, setRecord] = useState<User>(undefined)
    const [roles, setRoles] = useState<Role[]>([])
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { USERS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

    const formik = useFormik<User>({
        initialValues,
        validationSchema: userDetailsSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            values.mobile = Number(values.mobile)
            const respData = await updateRecord(values, id)
            setIsLoading(false)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Record updated successfully")
                setTimeout(() => {
                    navigate("/users")
                }, 1000)
            }else{
                setFormSubmitMsgType('error')
                setFormSubmitMsg(respData.data.message)
            }
        } catch (error) {
            setIsLoading(false)
        }
        },
    })



    useEffect(() => {
        async function loadUser(uuid: string) {
          try {
            setIsLoading(true)
            const response = await getUserById(uuid)
            if(response){
              formik.setFieldValue('full_name', response.full_name)
              formik.setFieldValue('email', response.email)
              formik.setFieldValue('mobile', response.mobile)
            //   formik.setFieldValue('is_active', response.is_active)
            //   initialValues.is_active = response.is_active
              formik.setFieldValue('roles', response.roles.map((item: Role) => item.id))
              formik.setFieldValue('permissions', response.permissions.map((item: Permission) => item.id))
              setRecord(response)
            }
          } catch (error) {
            const err = error as AxiosError
            setIsLoading(false)
            return err
          }
        }

        async function loadRoles() {
          try {
              setIsLoading(true)
              const response = await getRolesList()
              // @ts-ignore
              setRoles(response)
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
            const permissions = await getPermissionsList()
            // @ts-ignore
            setPermissions(permissions)
            setIsLoading(false)
          } catch (error) {
            const err = error as AxiosError
            setIsLoading(false)
            return err
          }
        }
        loadRoles()
        loadPermissions()
        loadUser(id ? id : '')
    }, [])

    const breadCrumbs = [
        {title: 'Users', path: USERS_PATH, isActive: false},
        {title: 'Update User', path: '', isActive: true}
    ]

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
                                            <form onSubmit={formik.handleSubmit} className='form relative' autoComplete="none">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h3 className="card-title">
                                                            Update user details: {record ? record.full_name : ''}
                                                            <Breadcrumbs links={breadCrumbs} />
                                                        </h3>
                                                        <div className="card-actions">
                                                            <a href={USERS_PATH} className="btn me-2">Cancel</a>
                                                            <button 
                                                                type='submit' 
                                                                // onClick={() => formik.handleSubmit}
                                                                className='btn btn-primary' 
                                                                // disabled={isLoading}
                                                                >
                                                                {!isLoading && 'Save'}
                                                                {isLoading && 'Please wait...'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-body border-bottom py-3">
                                                        <div className="row row-cards">
                                                            <div className="col-md-4">
                                                                <label htmlFor="full_name" className="form-label required">Name</label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        type='text'
                                                                        className={`form-control ${formik.touched.full_name && formik.errors.full_name ? 'is-invalid' : ''}`}
                                                                        {...formik.getFieldProps('full_name')}
                                                                    />
                                                                    {formik.touched.full_name && formik.errors.full_name && (
                                                                    <small className="invalid-feedback">{formik.errors.full_name}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label htmlFor="email" className="form-label required">Email</label>
                                                                <div className="mt-2">
                                                                    <input
                                                                        autoComplete='off'
                                                                        type='text'
                                                                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                                                        {...formik.getFieldProps('email')}
                                                                    />
                                                                    {formik.touched.email && formik.errors.email && (
                                                                    <small className="invalid-feedback">{formik.errors.email}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label htmlFor="mobile" className="form-label">Mobile</label>
                                                                <div className="mt-2">
                                                                    <input
                                                                    type="text"
                                                                    {...formik.getFieldProps('mobile')}
                                                                    autoComplete="street-address"
                                                                    className={`form-control ${formik.touched.mobile && formik.errors.mobile ? 'is-invalid' : ''}`}
                                                                    />
                                                                    {formik.touched.mobile && formik.errors.mobile && (
                                                                    <small className="invalid-feedback">{formik.errors.mobile}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label htmlFor="email" className="form-label required">Password</label>
                                                                <div className="mt-2">
                                                                    <input
                                                                    {...formik.getFieldProps('password')}
                                                                    type="password"
                                                                    autoComplete="off"
                                                                    className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                                                    />
                                                                    {formik.touched.password && formik.errors.password && (
                                                                    <small className="invalid-feedback">{formik.errors.password}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <label htmlFor="email" className="form-label required">Confirm Password</label>
                                                                <div className="mt-2">
                                                                    <input
                                                                    {...formik.getFieldProps('confirm_password')}
                                                                    type="password"
                                                                    autoComplete="off"
                                                                    className={`form-control ${formik.touched.confirm_password && formik.errors.confirm_password ? 'is-invalid' : ''}`}
                                                                    />
                                                                    {formik.touched.confirm_password && formik.errors.confirm_password && (
                                                                    <small className="invalid-feedback">{formik.errors.confirm_password}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <label className="form-check">
                                                                    <input
                                                                        {...formik.getFieldProps('is_active')}
                                                                        className='form-check-input w-45px h-30px'
                                                                        type='checkbox'
                                                                        id='is_active'
                                                                        defaultChecked={data.is_active}
                                                                    />
                                                                <span className="form-check-label" role="button">Active</span>
                                                                <span className="form-check-description curson-pointer" role="button">
                                                                    Check to make the user active/inactive, this allow/prevent user from accessing the app
                                                                </span>
                                                                </label>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label htmlFor="roles" className="form-label required">Select Roles</label>
                                                                <div className="mt-2">
                                                                    <select
                                                                    {...formik.getFieldProps('roles')}
                                                                    multiple={true}
                                                                    className={`form-control ${formik.touched.roles && formik.errors.roles ? 'is-invalid' : ''}`}
                                                                    >
                                                                        {roles.map((role) => (
                                                                            <option value={role.id}>{role.name}</option>
                                                                        ))}
                                                                    </select>
                                                                    {formik.touched.roles && formik.errors.roles && (
                                                                        // @ts-ignore
                                                                    <small className="invalid-feedback">{formik.errors.roles}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <label htmlFor="permissions" className="form-label">Select Permissions</label>
                                                                <div className="mt-2">
                                                                    <select
                                                                    {...formik.getFieldProps('permissions')}
                                                                    multiple={true}
                                                                    className="form-control"
                                                                    >
                                                                        {permissions.map((permission) => (
                                                                            <option value={permission.id}>{permission.name?.split("_").join(" ").toLocaleUpperCase()}</option>
                                                                        ))}
                                                                    </select>
                                                                    {formik.touched.permissions && formik.errors.permissions && (
                                                                        // @ts-ignore
                                                                    <small className="invalid-feedback">{formik.errors.permissions}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer d-flex align-items-end">
                                                        <a href={USERS_PATH} className="btn me-2">Cancel</a>
                                                        <button 
                                                            type='submit' 
                                                            className='btn btn-primary' 
                                                            disabled={isLoading}>
                                                            {!isLoading && 'Save'}
                                                            {isLoading && 'Please wait...'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
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

export default UpdateUser
