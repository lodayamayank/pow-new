import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
import React, { useEffect } from "react";

type Props = {
    children?: React.ReactNode
    clientId: string
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function List(props: Props) {
    const { children, clientId = undefined } = props
    
    return (
    <>
        <div className="border-bottom py-3">
            <div className="d-flex">
                <div className="text-secondary">
                    Search:
                    <div className="ms-2 d-inline-block">
                    <input type="text" className="form-control form-control-sm" aria-label="Search invoice" />
                    </div>
                </div>
                <div className="ms-auto text-secondary">
                <CanAccess permissions={['add_clients_brokers']}>
                    <button 
                    type='button' 
                    // onClick={() => navigate(0)}
                    className="btn btn-outline-primary d-none d-sm-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                    Add
                    </button>
                    <button
                    type='button' 
                    // onClick={() => navigate(0)}
                    className="btn btn-outline-primary d-sm-none btn-icon" aria-label="Create new">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                    </button>
                </CanAccess>
                </div>
            </div>
        </div>
        <div className="table-responsive">
            Subscriptions
        </div>
    </>
    )
}