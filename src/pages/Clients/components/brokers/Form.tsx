import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
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
                                {masterBrokers && masterBrokers.length > 0 && masterBrokers.filter((k) => k.is_active).map((item) => (
                                    <option value={item.uuid} key={item.uuid}>{item.name} ({item.dpid})</option>
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
                <label htmlFor="clientCode" className="form-label required">Client Code</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.clientCode && formik.errors.clientCode ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('clientCode')}
                    />
                    {formik.touched.clientCode && formik.errors.clientCode && (
                    <small className="invalid-feedback">{formik.errors.clientCode}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="boidDematNumber" className="form-label required">BOID Demat Number</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.boidDematNumber && formik.errors.boidDematNumber ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('boidDematNumber')}
                    />
                    {formik.touched.boidDematNumber && formik.errors.boidDematNumber && (
                    <small className="invalid-feedback">{formik.errors.boidDematNumber}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="mpin" className="form-label required">MPIN</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.mpin && formik.errors.mpin ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('mpin')}
                    />
                    {formik.touched.mpin && formik.errors.mpin && (
                    <small className="invalid-feedback">{formik.errors.mpin}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="password" className="form-label required">Password</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password && (
                    <small className="invalid-feedback">{formik.errors.password}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="toptSecretKey" className="form-label required">Topt Secret Key</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.toptSecretKey && formik.errors.toptSecretKey ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('toptSecretKey')}
                    />
                    {formik.touched.toptSecretKey && formik.errors.toptSecretKey && (
                    <small className="invalid-feedback">{formik.errors.toptSecretKey}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-4">
                <label htmlFor="cdslUsername" className="form-label reqduired">CDSL Username</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.cdslUsername && formik.errors.cdslUsername ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('cdslUsername')}
                    />
                    {formik.touched.cdslUsername && formik.errors.cdslUsername && (
                    <small className="invalid-feedback">{formik.errors.cdslUsername}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="cdslPassword" className="form-label requirded">CDSL Password</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.cdslPassword && formik.errors.cdslPassword ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('cdslPassword')}
                    />
                    {formik.touched.cdslPassword && formik.errors.cdslPassword && (
                    <small className="invalid-feedback">{formik.errors.cdslPassword}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="cdslSecretQuestion" className="form-label">CDSL Secret Question</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.cdslSecretQuestion && formik.errors.cdslSecretQuestion ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('cdslSecretQuestion')}
                    />
                    {formik.touched.cdslSecretQuestion && formik.errors.cdslSecretQuestion && (
                    <small className="invalid-feedback">{formik.errors.cdslSecretQuestion}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="cdslSecretAnswer" className="form-label reqduired">CDSL Secret Answer</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.cdslSecretAnswer && formik.errors.cdslSecretAnswer ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('cdslSecretAnswer')}
                    />
                    {formik.touched.cdslSecretAnswer && formik.errors.cdslSecretAnswer && (
                    <small className="invalid-feedback">{formik.errors.cdslSecretAnswer}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="cdslTPIN" className="form-label requdired">CDSL TPIN</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.cdslTPIN && formik.errors.cdslTPIN ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('cdslTPIN')}
                    />
                    {formik.touched.cdslTPIN && formik.errors.cdslTPIN && (
                    <small className="invalid-feedback">{formik.errors.cdslTPIN}</small>
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
                        defaultChecked={initialValues.is_active}
                        onChange={(e) => {
                            formik.setFieldValue('is_active', e.target.checked ? true : false)
                        }}
                    />
                <span className="form-check-label" role="button">Active</span>
                <span className="form-check-description curson-pointer" role="button">
                    Check to make the user active/inactive, this allow/prevent user from accessing the app
                </span>
                </label>
            </div>
        </div>
    </>
    )
}