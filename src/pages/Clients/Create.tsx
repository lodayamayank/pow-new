import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { Client, detailsInitValues as initialValues } from './core/_models'
import { createRecord } from './core/_requests'
import { CanAccess, Breadcrumbs, AlertMessage, ApplicationLayout, PageHeading } from '@/components'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useNavigate } from 'react-router-dom'
import { CrudForm } from './components'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const recordDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    nickname: Yup.string().required('Nick Name is required'),
    mobile: Yup.string().required("Mobile number is required").matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: Yup.string().required("Email is required").email("Invalid email address").matches(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Invalid email address"),
    // dob: Yup.date().max(eighteenYearsAgo, "You must be at least 18 years old").required("Date of birth is required"),
    dob: Yup.date()
    .when('pan', (panValue, schema) => {
        if (panValue[0] && panValue[0].length >= 4 && panValue[0][3].toLowerCase() === 'p') {
            const eighteenYearsAgo = new Date();
            eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
            return schema.max(eighteenYearsAgo, "You must be at least 18 years old");
        }
        return schema;
    }),
    // nomineeName: Yup.string().required('Nominee Name is required'),
    pan: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN must be in format AAAAA9999A').required('PAN is required'),
})

function Create() {
    const [data, setData] = useState<Client>(initialValues)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { CLIENTS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

    const formik = useFormik<Client>({
        initialValues,
        validationSchema: recordDetailsSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            // const formData = new FormData();
            // for (let value in values) {
            //     formData.append(value, values[value]);
            // }
            const respData = await createRecord(values)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Record added successfully")
                setTimeout(() => {
                    navigate(CLIENTS_PATH)
                }, 1000)
            }else{
                setFormSubmitMsgType('error')
                setFormSubmitMsg(respData.data.message)
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
        }
        },
    })

    const breadCrumbs = [
        {title: 'Clients', path: CLIENTS_PATH, isActive: false},
        {title: 'Create New Client', path: '', isActive: true}
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
                                                            Add new client
                                                            <Breadcrumbs links={breadCrumbs} />
                                                        </h3>
                                                        <div className="card-actions">
                                                            <a href={CLIENTS_PATH} className="btn me-2">Cancel</a>
                                                            <button 
                                                                type='submit' 
                                                                // onClick={() => formik.handleSubmit}
                                                                className='btn btn-primary' 
                                                                disabled={isLoading}
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
                                                        <a href={CLIENTS_PATH} className="btn me-2">Cancel</a>
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
