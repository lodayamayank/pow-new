import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { Broker, detailsInitValues as initialValues } from './core/_models'
import { updateRecord, getRecordById } from './core/_requests'
import { CanAccess, Breadcrumbs, Loader, AlertMessage, ApplicationLayout } from '@/components'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { CrudForm } from './components'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const recordDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    code: Yup.string().matches(/^[a-zA-Z0-9-_]*$/, 'Code must be alphanumeric and can include hyphens and underscores').required('Code is required'),
})


function Update() {
    const { id } = useParams()
    const [data, setData] = useState<Broker>(initialValues)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { MASTERDATA_BROKERS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

    const formik = useFormik<Broker>({
        initialValues,
        validationSchema: recordDetailsSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            for (let value in values) {
                formData.append(value, values[value]);
            }
            const respData = await updateRecord(formData, data && data.uuid ? data.uuid : id)
            setIsLoading(false)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Record updated successfully")
                setTimeout(() => {
                    navigate(MASTERDATA_BROKERS_PATH)
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
        async function loadRecord(uuid: string) {
          try {
            setIsLoading(true)
            const response = await getRecordById(uuid)
            if(response){
                formik.setFieldValue('name', response.name)
                formik.setFieldValue('code', response.code)
                formik.setFieldValue('dpid', response.dpid)
                formik.setFieldValue('description', response.description)
                formik.setFieldValue('etfs_isins', response.etfs_isins)
                formik.setFieldValue('etfs_scripcodes', response.etfs_scripcodes)
                formik.setFieldValue('is_active', response.is_active)
                initialValues.is_active = response.is_active
                initialValues.name = response.name
                initialValues.code = response.code
                initialValues.dpid = response.dpid
                initialValues.description = response.description
                initialValues.etfs_isins = response.etfs_isins
                initialValues.etfs_scripcodes = response.etfs_scripcodes
                setData(response)
            }
            setIsLoading(false)
          } catch (error) {
            const err = error as AxiosError
            setIsLoading(false)
            return err
          }
        }
        loadRecord(id ? id : '')
    }, [])

    const breadCrumbs = [
        {title: 'Master Data', path: MASTERDATA_BROKERS_PATH, isActive: true},
        {title: 'Brokers', path: MASTERDATA_BROKERS_PATH, isActive: false},
        {title: `Update Broker Details: ${data ? data.name : ''}`, path: '', isActive: true}
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
                                            <form onSubmit={formik.handleSubmit} className='form relative' autoComplete="none" encType='multipart/form-data'>
                                                <div className="card">
                                                    <div className="card-header">
                                                        <h3 className="card-title">
                                                            Update Broker Details: {data ? data.name : ''}
                                                            <Breadcrumbs links={breadCrumbs} />
                                                        </h3>
                                                        <div className="card-actions">
                                                            <a href={MASTERDATA_BROKERS_PATH} className="btn me-2">Cancel</a>
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
                                                        <CrudForm formik={formik} isEditMode={false} initialValues={initialValues}></CrudForm>
                                                    </div>
                                                    <div className="card-footer d-flex align-items-end">
                                                        <a href={MASTERDATA_BROKERS_PATH} className="btn me-2">Cancel</a>
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

export default Update