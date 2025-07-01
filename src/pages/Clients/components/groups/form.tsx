import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { Client, ClientGroup } from "../../core/_models";
import { getRecords as getClientsRecords } from "../../core/_requests";
import { AxiosError } from "axios";
import Select from 'react-select'

type Props = {
    children?: React.ReactNode
    formik: any
    initialValues: any
    isEditMode: boolean
    recordDetails?: ClientGroup | undefined
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}




export default function CrudForm(props: Props) {
    const { children, formik, initialValues, isEditMode = false, recordDetails = undefined } = props
    const [clients, setClients] = useState([])
    async function loadClients() {
        try {
          const response = await getClientsRecords()
          const recordsList = response?.data || [];
          setClients(recordsList.map((recordsList) => ({ "value": recordsList.uuid, "label": recordsList.name })))
        } catch (error) {
          const err = error as AxiosError
          return err
        }
    }

    useEffect(() => {
        loadClients()
    }, [])
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
            <div className="col-md-12">
                <label htmlFor="clients" className="form-label required">Select Clients</label>
                <div className="mb-3">
                    {clients && clients.length > 0 && (
                        <Select
                        options={clients}
                        isMulti={true}
                        // value={initialValues.clients}
                        placeholder="Select..."
                        isSearchable
                        // value={clients.filter(option => formik.clients.value.includes(option.uuid))}
                        {...formik.getFieldProps('clients')}
                        onChange={(option) => formik.setFieldValue('clients', option)}
                        />
                    )}
                    {formik.touched.clients && formik.errors.clients && (
                    <small className="invalid-feedback">{formik.errors.clients}</small>
                    )}
                </div>
            </div>
            <div className="col-md-4">
                <label htmlFor="parentClient" className="form-label required">Select Parent Client</label>
                <div className="mb-3">
                    {clients && clients.length > 0 && (
                        <Select
                        options={clients}
                        isMulti={false}
                        value={initialValues.parentClient}
                        placeholder="Select..."
                        isSearchable
                        {...formik.getFieldProps('parentClient')}
                        onChange={(option) => formik.setFieldValue('parentClient', option)}
                        />
                    )}
                    {formik.touched.parentClient && formik.errors.parentClient && (
                    <small className="invalid-feedback">{formik.errors.parentClient}</small>
                    )}
                </div>
            </div>
            <div className="col-md-8"></div>
            <div className="col-md-4">
                <label htmlFor="whatsappGroupID" className="form-label">Whatsapp Group ID</label>
                <div className="mt-2">
                    <input
                        type='text'
                        className={`form-control ${formik.touched.whatsappGroupID && formik.errors.whatsappGroupID ? 'is-invalid' : ''}`}
                        {...formik.getFieldProps('whatsappGroupID')}
                    />
                    {formik.touched.whatsappGroupID && formik.errors.whatsappGroupID && (
                    <small className="invalid-feedback">{formik.errors.whatsappGroupID}</small>
                    )}
                </div>
            </div>
            <div className="col-md-8">
                Groups List
            </div>
            <div className="col-md-6">
                <label htmlFor="details" className="form-label">Description</label>
                <div className="mb-3">
                    <textarea 
                    {...formik.getFieldProps('details')}
                    className={`form-control ${formik.touched.details && formik.errors.details ? 'is-invalid' : ''}`}
                    rows={4}
                    ></textarea>
                    {formik.touched.details && formik.errors.details && (
                    <small className="invalid-feedback">{formik.errors.details}</small>
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
                </label>
            </div>
        </div>
    </>
    )
}