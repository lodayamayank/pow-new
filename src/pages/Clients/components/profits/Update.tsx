import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import CrudForm from "./Form";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup'
import { ClientProfitSettled, clientProfitsSettledDetailsInitValues as initialValues } from "../../core/_models";
import { getClientProfitsRecordById, updateClientProfitsRecord } from "../../core/_requests";
import { AlertMessage } from "@/components";
import { AxiosError } from "axios";
import moment from "moment";

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
    amount: Yup.number().required('Field is required'),
    settledDate: Yup.string().required('Field is required'),
})

export function Create(props: Props) {
    const { children, clientId = undefined, setCurrentAction, currentAction, currentRecordId } = props
    const navigate = useNavigate()
    const [data, setData] = useState<ClientProfitSettled>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')
    async function loadRecord(uuid: string) {
        try {
          setIsLoading(true)
          const response = await getClientProfitsRecordById(clientId, uuid)
          if(response){
                formik.setFieldValue('amount', response.amount)
                formik.setFieldValue('settledDate', moment(response.settledDate).format("YYYY-MM-DD"))
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

    const formik = useFormik<ClientProfitSettled>({
        initialValues,
        validationSchema: recordDetailsSchema,
        onSubmit: async (values, {resetForm}) => {
        setIsLoading(true)
        try {
            values.amount = Number(values.amount)
            const respData = await updateClientProfitsRecord(clientId,currentRecordId,values)
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
                        <h3 className="card-title">Update Client Broker Profits Settled ({data ? data.broker.name : ''})</h3>
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