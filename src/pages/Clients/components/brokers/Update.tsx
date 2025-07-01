import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import CrudForm from "./Form";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup'
import { ClientBroker, clientBrokerDetailsInitValues as initialValues } from "../../core/_models";
import { createClientBrokerRecord, getClientBrokerRecordById, updateClientBrokerRecord } from "../../core/_requests";
import { AlertMessage } from "@/components";
import { AxiosError } from "axios";

type Props = {
    children?: React.ReactNode
    clientId: string
    currentAction: string
    setCurrentAction: any
    currentRecordId: string
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const recordDetailsSchema = Yup.object().shape({
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
    const { children, clientId = undefined, setCurrentAction, currentAction, currentRecordId } = props
    const navigate = useNavigate()
    const [data, setData] = useState<ClientBroker>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')
    async function loadRecord(uuid: string) {
        try {
          setIsLoading(true)
          const response = await getClientBrokerRecordById(clientId, uuid)
          if(response){
              formik.setFieldValue('clientCode', response.clientCode)
              formik.setFieldValue('boidDematNumber', response.boidDematNumber)
              formik.setFieldValue('mpin', response.mpin)
              formik.setFieldValue('password', response.password)
              formik.setFieldValue('toptSecretKey', response.toptSecretKey)
              formik.setFieldValue('cdslUsername', response.cdslUsername)
              formik.setFieldValue('cdslPassword', response.cdslPassword)
              formik.setFieldValue('cdslSecretQuestion', response.cdslSecretQuestion)
              formik.setFieldValue('cdslSecretAnswer', response.cdslSecretAnswer)
              formik.setFieldValue('cdslTPIN', response.cdslTPIN)
              formik.setFieldValue('is_active', response.is_active)
              setData(response)
          }
          setIsLoading(false)
        } catch (error) {
          const err = error as AxiosError
          setIsLoading(false)
          return err
        }
    }
    useEffect(() => {
        loadRecord(currentRecordId ? currentRecordId : '')
    }, [])

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
            const respData = await updateClientBrokerRecord(clientId,currentRecordId,values)
            setIsLoading(false)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Record updated successfully")
                setTimeout(() => {
                    resetForm()
                    setCurrentAction('list')
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
    return (
    <>
        <div className="row row-cards">
            <div className="col-12">
            {formSubmitMsg && (<AlertMessage setFormSubmitMsg={setFormSubmitMsg} alertType={formSubmitMsgType} alertMessage={formSubmitMsg} />)}
            <form onSubmit={formik.handleSubmit} className='card border-0' autoComplete="none">
                    <div className="card-header">
                        <h3 className="card-title">Update Broker Account Details ({data ? data.clientCode : ''})</h3>
                        <div className="card-actions btn-actions">
                            <button onClick={() => setCurrentAction('list')} className="btn-action">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <CrudForm formik={formik} isEditMode={true} initialValues={initialValues} />
                    </div>
                    <div className="card-footer text-end">
                        <span className="text-danger">{formSubmitMsg}</span>
                        <button type="button" onClick={() => setCurrentAction('list')} className="btn me-2">Back to list</button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </>
    )
}