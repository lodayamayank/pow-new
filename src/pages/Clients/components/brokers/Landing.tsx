import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import {List as ClientBrokerList} from "./List";
import {Create as ClientBrokerCreate} from "./Create";
import {Create as ClientBrokerUpdate} from "./Update";

type Props = {
    children?: React.ReactNode
    clientId: string
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Landing(props: Props) {
    const { children, clientId } = props
    const [currentAction, setCurrentAction] = useState<string>('list')
    const [currentRecordId, setCurrentRecordId] = useState<string>()

    return (
    <>  
        <div className="p-0">
        {currentAction == "list" && (
            <ClientBrokerList setCurrentRecordId={setCurrentRecordId} currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}

        {currentAction == "add" && (
            <ClientBrokerCreate currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}

        {currentAction == "update" && (
            <ClientBrokerUpdate currentRecordId={currentRecordId} currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}
        </div>
    </>
    )
}