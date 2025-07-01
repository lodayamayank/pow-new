import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import CrudForm from "./Form";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup'
import { ClientBroker, clientBrokerDetailsInitValues as initialValues } from "../../core/_models";
import { createClientBrokerRecord } from "../../core/_requests";
import { AlertMessage } from "@/components";

type Props = {
    children?: React.ReactNode
    clientId: string
    currentAction: string
    setCurrentAction: any
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const recordDetailsSchema = Yup.object().shape({
    brokerId: Yup.string().required('Broker is required'),
    clientCode: Yup.string().required('Field is required'),
    boidDematNumber: Yup.string().required('Field is required'),
    mpin: Yup.string().required('Field is required'),
    password: Yup.string().required('Field is required'),
    toptSecretKey: Yup.string().required('Field is required'),
    // cdslUsername: Yup.string().required('Field is required'),
    // cdslPassword: Yup.string().required('Field is required'),
    // cdslSecretQuestion: Yup.string().required('Field is required'),
    // cdslSecretAnswer: Yup.string().required('Field is required'),
    // cdslTPIN: Yup.string().required('Field is required'),
})

export function Create(props: Props) {
    const { children, clientId = undefined, setCurrentAction, currentAction } = props
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

    const formik = useFormik<ClientBroker>({
        initialValues,
        validationSchema: recordDetailsSchema,
        onSubmit: async (values, {resetForm}) => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            for (let value in values) {
                formData.append(value, values[value]);
            }
            const respData = await createClientBrokerRecord(clientId,values)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Record added successfully")
                setIsLoading(false)
                setTimeout(() => {
                    // navigate(MASTERDATA_BROKERS_PATH)
                    resetForm()
                    setCurrentAction('list')
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
    return (
    <>
        <div className="row row-cards">
            <div className="col-12">
            {formSubmitMsg && (<AlertMessage setFormSubmitMsg={setFormSubmitMsg} alertType={formSubmitMsgType} alertMessage={formSubmitMsg} />)}
            <form onSubmit={formik.handleSubmit} className='card border-0' autoComplete="none">
                    <div className="card-header">
                        <h3 className="card-title">Add Client Broker Account</h3>
                        <div className="card-actions btn-actions">
                            <button onClick={() => setCurrentAction('list')} className="btn-action">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <CrudForm formik={formik} isEditMode={false} initialValues={initialValues} />
                    </div>
                    <div className="card-footer text-end">
                        <span className="text-danger me-5">{formSubmitMsg}</span>
                        <button type="button" onClick={() => setCurrentAction('list')} className="btn me-2">Back to list</button>
                        <button 
                            type='submit' 
                            className='btn btn-primary' 
                            disabled={isLoading}>
                            {!isLoading && 'Save'}
                            {isLoading && 'Please wait...'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
    )
}