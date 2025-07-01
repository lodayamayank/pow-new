import { CanAccess } from "@/components/CanAccess"
import { useRoutePaths, useSession } from "@/hooks"
import { FormikConfig, FormikFormProps, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import {List as ClientAUMList} from "./List";
import {Create as ClientAUMCreate} from "./Create";
import {Create as ClientAUMUpdate} from "./Update";

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
            <ClientAUMList setCurrentRecordId={setCurrentRecordId} currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}

        {currentAction == "add" && (
            <ClientAUMCreate currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}

        {currentAction == "update" && (
            <ClientAUMUpdate currentRecordId={currentRecordId} currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}
        </div>
    </>
    )
}