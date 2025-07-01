import { calcTotalETFGainsLiquid, calcTotalETFGainsLiquidDB, calcTotalETFGainsOthers, calcTotalETFGainsOthersDB, sumOfValuesForKey } from "@/utils";
import moment from "moment";
import React, { useState } from "react";

type Props = {
    children?: React.ReactNode
    records: any
    clientBrokerDetails: any
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function ETFDBTable(props: Props) {
    const { children, records, clientBrokerDetails } = props
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
        <div className="row row-cards m-3">
            {'ETF_HOLDING_VALUATION' in records && records.ETF_HOLDING_VALUATION ? (
                <>
                    <div className="col-6">
                        <div className="card card-sm">
                            <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                <div className="font-weight-medium">
                                    {calcTotalETFGainsLiquidDB(records, clientBrokerDetails).toFixed(2)}
                                </div>
                                <div className="text-secondary">
                                    ETF Gains Liquid Bees
                                </div>
                                </div>
                                <div className="col-auto">
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card card-sm">
                            <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                <div className="font-weight-medium">
                                    {calcTotalETFGainsOthersDB(records, clientBrokerDetails).toFixed(2)}
                                </div>
                                <div className="text-secondary">
                                    ETF Gains Others
                                </div>
                                </div>
                                <div className="col-auto">
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </>
            ): (
                <div className="col-6">
                    <div className="card card-sm">
                        <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col">
                            <div className="font-weight-medium">
                            {records && 'ETF_TRANSACTION_REPORT' in records && records.ETF_TRANSACTION_REPORT.length > 0 ? (parseFloat(sumOfValuesForKey(records.ETF_TRANSACTION_REPORT,'buyValue')) - parseFloat(sumOfValuesForKey(records.ETF_TRANSACTION_REPORT,'sellValue'))).toFixed(2) : 0}/
                            </div>
                            <div className="text-secondary">
                                Total ETF Gains
                            </div>
                            </div>
                            <div className="col-auto">
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="table-responsive">
            {'ETF_HOLDING_VALUATION' in records && records.ETF_HOLDING_VALUATION && (
                <>
                <h2 className="p-4 pt-4 pb-2">Transaction Report</h2>
                <table className="table table-vcenter card-table">
                    <thead>
                        <tr>
                            <th>ETF Details</th>
                            <th>Date</th>
                            <th>Buy Value</th>
                            <th>Sell Value</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {'ETF_TRANSACTION_REPORT' in records && records.ETF_TRANSACTION_REPORT && records.ETF_TRANSACTION_REPORT.map((record) => (
                            <tr>
                                <td>{record.details}</td>
                                <td className="text-nowrap">{record.buySellDate}</td>
                                <td>{record.buyValue}</td>
                                <td>{record.sellValue}</td>
                                <td className={`${record.buy_value-record.sell_value < 0 ? 'text-red' : 'text-green'}`}>{(record.buyValue-record.sellValue).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <th colSpan={4} className="text-end">Total</th>
                            <th colSpan={1}>{'ETF_TRANSACTION_REPORT' in records && records.ETF_TRANSACTION_REPORT && records.ETF_TRANSACTION_REPORT.length > 0 ? (parseFloat(sumOfValuesForKey(records.ETF_TRANSACTION_REPORT,'buyValue'))-parseFloat(sumOfValuesForKey(records.ETF_TRANSACTION_REPORT,'sellValue'))).toFixed(2) : 0}</th>
                        </tr>
                    </tbody>
                </table>
                <h2 className="p-4 pt-4 pb-2">Previous Holding Valuation</h2>
                <table className="table table-vcenter card-table">
                    <thead>
                        <tr>
                            <th>ETF Details</th>
                            <th>Date</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {'ETF_HOLDING_VALUATIONPrevious' in records && records.ETF_HOLDING_VALUATIONPrevious && records.ETF_HOLDING_VALUATIONPrevious.map((record) => (
                            <tr>
                                <td>{record.details}</td>
                                <td className="text-nowrap">{moment(record.entryDate).format("DD-MM-YYYY")}</td>
                                <td>{record.valuation}</td>
                            </tr>
                        ))}
                        <tr>
                            <th className="text-end" colSpan={2}>Final</th>
                            <th>{'ETF_HOLDING_VALUATIONPrevious' in records && records.ETF_HOLDING_VALUATIONPrevious && records.ETF_HOLDING_VALUATIONPrevious.length > 0 ? (parseFloat(records.ETF_HOLDING_VALUATIONPrevious[records.ETF_HOLDING_VALUATIONPrevious.length-1]['valuation'])).toFixed(2) : 0}</th>
                        </tr>
                    </tbody>
                </table>
                <h2 className="p-4 pt-4 pb-2">Current Holding Valuation</h2>
                <table className="table table-vcenter card-table">
                    <thead>
                        <tr>
                            <th>ETF Details</th>
                            <th>Date</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.ETF_HOLDING_VALUATION && records.ETF_HOLDING_VALUATION.map((record) => (
                            <tr>
                                <td>{record.details}</td>
                                <td className="text-nowrap">{moment(record.entryDate).format("DD-MM-YYYY")}</td>
                                <td>{record.valuation}</td>
                            </tr>
                        ))}
                        <tr>
                            <th className="text-end" colSpan={2}>Final</th>
                            <th>{records.ETF_HOLDING_VALUATION && 'ETF_HOLDING_VALUATION' in records && records.ETF_HOLDING_VALUATION.length > 0 ? (parseFloat(records.ETF_HOLDING_VALUATION[records.ETF_HOLDING_VALUATION.length-1]['valuation'])).toFixed(2) : 0}</th>
                        </tr>
                    </tbody>
                </table>
                </>
            )}
        </div>
    </>
    )
}