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

export function FnOTable(props: Props) {
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
            <table className="table table-vcenter card-table">
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
                    {records && records.length > 0 && records.map((record) => (
                        <tr>
                            <td>{record.scrip_code}</td>
                            <td className="text-nowrap">{record.buy_date ? moment(record.buy_date,'YYYY-MM-DD').format("DD MMM, YYYY") : ''}</td>
                            <td>{record.buy_quantity}</td>
                            <td>{record.avg_buy_price}</td>
                            <td>{record.buy_value.toFixed(2)}</td>
                            <td className="text-nowrap">{record.sell_date ? moment(record.sell_date,'YYYY-MM-DD').format("DD MMM, YYYY") : ''}</td>
                            <td>{record.sell_quantity}</td>
                            <td>{record.avg_sell_price}</td>
                            <td>{record.sell_value.toFixed(2)}</td>
                            <td className={`${record.gross_pnl < 0 ? 'text-red' : 'text-green'}`}>{record.gross_pnl.toFixed(2)}</td>
                            <td>{record.charges.toFixed(2)}</td>
                            <td className={`${record.gross_pnl-record.charges < 0 ? 'text-red' : 'text-green'}`}>{(record.gross_pnl-record.charges).toFixed(2)}</td>
                        </tr>
                    ))}
                    <tr>
                        <th colSpan={11} className="text-end">Total Net PnL</th>
                        <th>{(parseFloat(sumOfValuesForKey(records,'gross_pnl'))-parseFloat(sumOfValuesForKey(records,'charges'))).toFixed(2)}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
    )
}