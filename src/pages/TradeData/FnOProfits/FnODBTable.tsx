import { sumOfValuesForKey } from "@/utils";
import moment from "moment";
import React from "react";

type Props = {
    children?: React.ReactNode
    records: any
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function FnODBTable(props: Props) {
    const { children, records } = props
    
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
                        <th>Scrip Code</th>
                        <th>Buy Date</th>
                        <th>Buy Quantity</th>
                        <th>Average Buy Price</th>
                        <th>Buy Value</th>
                        <th>Sell Date</th>
                        <th>Sell Quantity</th>
                        <th>Average Sell Quantity</th>
                        <th>Sell Value</th>
                        <th>Gross P&L</th>
                        <th>Charges</th>
                        <th>Net P&L</th>
                    </tr>
                </thead>
                <tbody>
                    {records && records.length > 0 && records.map((record) => {
                        return (
                        <tr>
                            <td>{record.scripCode}</td>
                            <td className="text-nowrap">{record.buyDate ? moment(record.buyDate,'YYYY-MM-DD').format("DD MMM, YYYY") : ''}</td>
                            <td>{record.buyQuantity}</td>
                            <td>{record.averageBuyPrice}</td>
                            <td>{record.buyValue.toFixed(2)}</td>
                            <td className="text-nowrap">{record.sellDate ? moment(record.sellDate,'YYYY-MM-DD').format("DD MMM, YYYY") : ''}</td>
                            <td>{record.sellQuantity}</td>
                            <td>{record.averageSellPrice}</td>
                            <td>{record.sellValue.toFixed(2)}</td>
                            <td className={`${record.grossPNL < 0 ? 'text-red' : 'text-green'}`}>{record.grossPNL.toFixed(2)}</td>
                            <td>{record.charges.toFixed(2)}</td>
                            <td className={`${record.netPNL < 0 ? 'text-red' : 'text-green'}`}>{Number(record.netPNL.toFixed(2)).toLocaleString("en-IN")}</td>
                        </tr>
                    )})}
                    <tr>
                        <th colSpan={7} className="text-end">Total</th>
                        <th>{Number((parseFloat(sumOfValuesForKey(records,'buyValue'))).toFixed(2)).toLocaleString("en-IN")}</th>
                        <th>{Number((parseFloat(sumOfValuesForKey(records,'sellValue'))).toFixed(2)).toLocaleString("en-IN")}</th>
                        <th>{Number((parseFloat(sumOfValuesForKey(records,'grossPNL'))).toFixed(2)).toLocaleString("en-IN")}</th>
                        <th>{Number((parseFloat(sumOfValuesForKey(records,'charges'))).toFixed(2)).toLocaleString("en-IN")}</th>
                        <th>{Number((parseFloat(sumOfValuesForKey(records,'netPNL'))).toFixed(2)).toLocaleString("en-IN")}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
    )
}