import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
import React, { useEffect } from "react";
import { Client } from "../core/_models";

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
    return (
    <>
        <div className="row row-cards">
            <div className="col-md-4">
                <label htmlFor="name" className="form-label required">Name</label>
                <div className="mt-2">
                    <input
                        type='text'
                        id="name"
                        required={true}
                        className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('name')}
                    />
                    {formik.touched.name && formik.errors.name && (
                    <small className="invalid-feedback">{formik.errors.name}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="nickname" className="form-label required">Nick Name</label>
                <div className="mt-2">
                    <input
                        id="nickname"
                        type='text'
                        required={true}
                        className={`form-control ${formik.touched.nickname && formik.errors.nickname ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('nickname')}
                    />
                    {formik.touched.nickname && formik.errors.nickname && (
                    <small className="invalid-feedback">{formik.errors.nickname}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4"></div>
            <div className="col-md-4">
                <label htmlFor="mobile" className="form-label required">Mobile</label>
                <div className="mt-2">
                    <input
                        type='number'
                        required={true}
                        className={`form-control ${formik.touched.mobile && formik.errors.mobile ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('mobile')}
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                    <small className="invalid-feedback">{formik.errors.mobile}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="email" className="form-label required">Email</label>
                <div className="mt-2">
                    <input
                        type='email'
                        required={true}
                        className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                    <small className="invalid-feedback">{formik.errors.email}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="altEmail" className="form-label">Alternate Emails</label>
                <div className="mt-2">
                    <input
                        type='altEmail'
                        className={`form-control ${formik.touched.altEmail && formik.errors.altEmail ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('altEmail')}
                    />
                    {formik.touched.altEmail && formik.errors.altEmail && (
                    <small className="invalid-feedback">{formik.errors.altEmail}</small>
                    )}
                    <span className="form-check-description curson-pointer" role="button">
                        Enter multiple emails comma separated
                    </span>
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="pan" className="form-label required">PAN</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.pan && formik.errors.pan ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('pan')}
                    />
                    {formik.touched.pan && formik.errors.pan && (
                    <small className="invalid-feedback">{formik.errors.pan}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="dob" className="form-label required">DOB</label>
                <div className="mt-2">
                    <input
                        type='date'
                        className={`form-control ${formik.touched.dob && formik.errors.dob ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('dob')}
                        placeholder="YYYY-MM-DD"
                    />
                    {formik.touched.dob && formik.errors.dob && (
                    <small className="invalid-feedback">{formik.errors.dob}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="nomineeName" className="form-label requidred">Nominee Name</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.nomineeName && formik.errors.nomineeName ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('nomineeName')}
                    />
                    {formik.touched.nomineeName && formik.errors.nomineeName && (
                    <small className="invalid-feedback">{formik.errors.nomineeName}</small>
                    )}
                </div>
            </div>
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
            <div className="col-md-4">
                <label className="form-check">
                    <input
                        {...formik.getFieldProps('weeklyReport')}
                        className='form-check-input w-45px h-30px'
                        type='checkbox'
                        id='weeklyReport'
                        defaultChecked={initialValues.weeklyReport}
                        onChange={(e) => {
                            formik.setFieldValue('weeklyReport', e.target.checked ? true : false)
                        }}
                    />
                <span className="form-check-label" role="button">Weekly Report</span>
                <span className="form-check-description curson-pointer" role="button">
                    Check to send the weekly report to client
                </span>
                </label>
            </div>
            <div className="col-md-4">
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