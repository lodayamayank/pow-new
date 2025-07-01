import moment from "moment";
import React from "react";

type Props = {
    children?: React.ReactNode
    ledgerRecords: any
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function LedgerTable(props: Props) {
    const { children, ledgerRecords } = props
    
    return (
    <>
        <div className="border-bottom py-3 d-none">
            <div className="d-flex px-4">
                <div className="text-secondary">
                    Search:
                    <div className="ms-2 d-inline-block">
                    <input type="text" className="form-control form-control-sm" aria-label="Search invoice" />
                    </div>
                </div>
                <div className="ms-auto text-secondary">
                </div>
            </div>
        </div>
        <div className="table-responsive">
            <table className="table table-vcenter card-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Exchange</th>
                        <th>Particulars</th>
                        <th>Category</th>
                        <th>Credit</th>
                        <th>Debit</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {ledgerRecords && ledgerRecords.map((record) => {
                        if(!record.entryDate.includes("In case of any discrepancy") && !record.particulars.includes("Opening balance")){
                        return (
                        <tr>
                            <td className=" text-nowrap">{moment(record.entryDate).format("DD-MM-YYYY")}</td>
                            <td>{record.exchange}</td>
                            <td>{record.particulars}</td>
                            <td>{record.category}</td>
                            <td>{record.credit}</td>
                            <td>{record.debit}</td>
                            <td>{record.balance}</td>
                        </tr>
                    )}})}
                </tbody>
            </table>
        </div>
    </>
    )
}