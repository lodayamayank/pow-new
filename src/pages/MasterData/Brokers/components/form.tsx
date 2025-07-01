import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
import React, { useEffect } from "react";
import { Broker } from "../core/_models";

type Props = {
    children?: React.ReactNode
    formik: any
    initialValues: any
    isEditMode: boolean
    recordDetails?: Broker | undefined
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function CrudForm(props: Props) {
    const { children, formik, initialValues, isEditMode = false, recordDetails = undefined } = props
    return (
    <>
        <div className="row row-cards">
            <div className="col-md-4">
                <label htmlFor="name" className="form-label required">Name</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name && (
                    <small className="invalid-feedback">{formik.errors.name}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="code" className="form-label required">Code</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.code && formik.errors.code ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('code')}
                    />
                    {formik.touched.code && formik.errors.code && (
                    <small className="invalid-feedback">{formik.errors.code}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="dpid" className="form-label required">DP ID</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.dpid && formik.errors.dpid ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('dpid')}
                    />
                    {formik.touched.dpid && formik.errors.dpid && (
                    <small className="invalid-feedback">{formik.errors.dpid}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="logo" className="form-label">Broker Logo</label>
                <div className="mb-3">
                    <input
                        type='file'
                        className={`form-control ${formik.touched.logo && formik.errors.logo ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('logo')}
                    />
                    {formik.touched.logo && formik.errors.logo && (
                    <small className="invalid-feedback">{formik.errors.logo}</small>
                    )}
                </div>
            </div>
            <div className="col-md-8"></div>
            <div className="col-md-6">
                <label htmlFor="description" className="form-label">Description</label>
                <div className="mb-3">
                    <textarea 
                    {...formik.getFieldProps('description')}
                    className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                    rows={4}
                    ></textarea>
                    {formik.touched.description && formik.errors.description && (
                    <small className="invalid-feedback">{formik.errors.description}</small>
                    )}
                </div>
            </div>
            <div className="col-md-6"></div>
            <div className="col-md-6">
                <label htmlFor="etfs_isins" className="form-label">ETF ISIN</label>
                <div className="mb-3">
                    <textarea 
                    {...formik.getFieldProps('etfs_isins')}
                    className={`form-control ${formik.touched.etfs_isins && formik.errors.etfs_isins ? 'is-invalid' : ''}`}
                    rows={4}
                    ></textarea>
                    {formik.touched.etfs_isins && formik.errors.etfs_isins && (
                    <small className="invalid-feedback">{formik.errors.etfs_isins}</small>
                    )}
                </div>
            </div>
            <div className="col-md-6">
                <label htmlFor="etfs_scripcodes" className="form-label">ETF Scrip Codes</label>
                <div className="mb-3">
                    <textarea 
                    {...formik.getFieldProps('etfs_scripcodes')}
                    className={`form-control ${formik.touched.etfs_scripcodes && formik.errors.etfs_scripcodes ? 'is-invalid' : ''}`}
                    rows={4}
                    ></textarea>
                    {formik.touched.etfs_scripcodes && formik.errors.etfs_scripcodes && (
                    <small className="invalid-feedback">{formik.errors.etfs_scripcodes}</small>
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
                        defaultChecked={recordDetails ? recordDetails.is_active : true}
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