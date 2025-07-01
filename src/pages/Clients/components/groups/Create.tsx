import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'

import { CanAccess, Breadcrumbs, AlertMessage, ApplicationLayout, PageHeading } from '@/components'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useNavigate } from 'react-router-dom'
import CrudForm from './form'
import { ClientGroup, clientGroupsInitValues as initialValues } from '../../core/_models'
import { createClientGroupRecord, getClientGroupRecordById, updateClientGroupRecord } from '../../core/_requests'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const recordDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    clients: Yup.array().min(1, 'At least one client is required').required('Required'),
    // parentClient: Yup.string().required('Parent client is required'),
})

function Create() {
    const [data, setData] = useState<ClientGroup>(initialValues)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { CLIENT_GROUPS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

    const formik = useFormik<ClientGroup>({
        initialValues,
        validationSchema: recordDetailsSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            let valuesCP = values 
            valuesCP.clients = values.clients.map((clientItem) => clientItem.value)
            valuesCP.parentClient = values.parentClient.value
            const respData = await createClientGroupRecord(valuesCP)
            setIsLoading(false)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Record added successfully")
                setTimeout(() => {
                    navigate(CLIENT_GROUPS_PATH)
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

    const breadCrumbs = [
        {title: 'Client Groups', path: CLIENT_GROUPS_PATH, isActive: false},
        {title: 'Create New Clients Group', path: '', isActive: true}
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
                                                            Add new clients group
                                                            <Breadcrumbs links={breadCrumbs} />
                                                        </h3>
                                                        <div className="card-actions">
                                                            <a href={CLIENT_GROUPS_PATH} className="btn me-2">Cancel</a>
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
                                                        <a href={CLIENT_GROUPS_PATH} className="btn me-2">Cancel</a>
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

export default Create
