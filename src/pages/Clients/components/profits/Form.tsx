import React, { useEffect, useState } from "react";
import { Client } from "../../core/_models";
import { Broker } from "@/pages/MasterData/Brokers/core/_models";
import { getRecords as getMasterBrokersList } from "@/pages/MasterData/Brokers/core/_requests";
import { stringifyRequestQuery } from "@/utils/libs/crud-helper";
import { AxiosError } from "axios";
import { pagination_items_per_page } from "@/utils";

type Props = {
    children?: React.ReactNode
    formik: any
    initialValues: any
    isEditMode: boolean
    recordDetails?: Client | undefined
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function CrudForm(props: Props) {
    const { children, formik, initialValues, isEditMode = false, recordDetails = undefined } = props
    const [masterBrokers, setMasterBrokers] = useState<Broker[]>([])
    const [search, setSerach] = useState<string>()
    const [page, setPage] = useState<number>()
    const [items_per_page, setitemsPerPage] = useState<number>(pagination_items_per_page)
    const loadMasterBrokersList = async () => {
        try {
            const response = await getMasterBrokersList(stringifyRequestQuery({search,page,items_per_page}))
            const recordsList = response?.data || [];
            setMasterBrokers(recordsList)
        } catch (error) {
            const err = error as AxiosError
            return err
        }
    }

    useEffect(() => {
        loadMasterBrokersList()
    }, [])
    return (
    <>
        <div className="row row-cards">
            {!isEditMode && (
                <>
                    <div className="col-md-4">
                        <div className="mb-3">
                        <label className="form-label">Select Broker</label>
                            <select 
                            className={`form-control form-select ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                            {...formik.getFieldProps('brokerId')}
                            >
                                <option value="">Select</option>
                                {recordDetails && recordDetails.brokerDetails.length > 0 && recordDetails.brokerDetails.map((item) => (
                                    <option value={item.broker.uuid} key={item.broker.uuid}>{item.broker.name} ({item.clientCode})</option>
                                ))}
                            </select>
                            {formik.touched.brokerId && formik.errors.brokerId && (
                            <small className="invalid-feedback">{formik.errors.brokerId}</small>
                            )}
                        </div>
                    </div>
                    <div className="col-md-8"></div>
                </>  
            )}
            <div className="col-md-4">
                <label htmlFor="amount" className="form-label required">Amount</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.amount && formik.errors.amount ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('amount')}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                    <small className="invalid-feedback">{formik.errors.amount}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="settledDate" className="form-label required">Settled Date</label>
                <div className="mt-2">
                    <input
                        type='date'
                        className={`form-control ${formik.touched.settledDate && formik.errors.settledDate ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('settledDate')}
                        // pattern="\d{4}-\d{2}-\d{2}"
                        required={true}
                    />
                    {formik.touched.settledDate && formik.errors.settledDate && (
                    <small className="invalid-feedback">{formik.errors.settledDate}</small>
                    )}
                </div>
            </div>
        </div>
    </>
    )
}