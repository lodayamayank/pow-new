import React, { useEffect, useState } from "react";
import {List as ClientAdjustmentsList} from "./List";
import {Create as ClientAdjustmentsCreate} from "./Create";
import {Create as ClientAdjustmentsUpdate} from "./Update";

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
            <ClientAdjustmentsList setCurrentRecordId={setCurrentRecordId} currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}

        {currentAction == "add" && (
            <ClientAdjustmentsCreate currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}

        {currentAction == "update" && (
            <ClientAdjustmentsUpdate currentRecordId={currentRecordId} currentAction={currentAction} clientId={clientId} setCurrentAction={setCurrentAction} />
        )}
        </div>
    </>
    )
}