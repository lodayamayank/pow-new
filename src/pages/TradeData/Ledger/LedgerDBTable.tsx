import moment from "moment"
import React from "react"

type Props = {
    children?: React.ReactNode
    ledgerRecords: any
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function LedgerDBTable(props: Props) {
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
            <table className="to_export table table-vcenter card-table">
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
                        return (
                        <tr>
                            <td className=" text-nowrap">{moment(record.entryDate).format("DD-MM-YYYY")}</td>
                            <td>{record.exchange.toUpperCase()}</td>
                            <td>{record.particulars}</td>
                            <td>{record.category}</td>
                            <td>{record.credit.toLocaleString('en-IN')}</td>
                            <td>{record.debit.toLocaleString('en-IN')}</td>
                            <td>{record.balance != "" ? Number(record.balance).toLocaleString('en-IN') : "-"}</td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    </>
    )
}