import { calcTotalETFGainsLiquid, calcTotalETFGainsOthers, sumOfValuesForKey } from "@/utils";
import moment from "moment";
import React, { useState } from "react";

type Props = {
    children?: React.ReactNode
    records: any
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function ETFTable(props: Props) {
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
        <div className="row row-cards m-3">
            {records.finalDataHoldingValuationCurrent ? (
                <>
                    <div className="col-6">
                        <div className="card card-sm">
                            <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col">
                                <div className="font-weight-medium">
                                    {calcTotalETFGainsLiquid(records)}
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
                                    {calcTotalETFGainsOthers(records)}
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
                            {records && records.length > 0 ? (parseFloat(sumOfValuesForKey(records,'buy_value')) - parseFloat(sumOfValuesForKey(records,'sell_value'))).toFixed(2) : 0}
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
            {records.finalDataHoldingValuationCurrent ? (
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
                        {records.finalDataTransactionReport && records.finalDataTransactionReport.map((record) => (
                            <tr>
                                <td>{record.etf_details}</td>
                                <td className="text-nowrap">{record.buysell_date}</td>
                                <td>{record.buy_value}</td>
                                <td>{record.sell_value}</td>
                                <td className={`${record.buy_value-record.sell_value < 0 ? 'text-red' : 'text-green'}`}>{(record.buy_value-record.sell_value).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <th colSpan={4} className="text-end">Total</th>
                            <th colSpan={1}>{records.finalDataTransactionReport && records.finalDataTransactionReport.length > 0 ? (parseFloat(sumOfValuesForKey(records.finalDataTransactionReport,'buy_value'))-parseFloat(sumOfValuesForKey(records.finalDataTransactionReport,'sell_value'))).toFixed(2) : 0}</th>
                        </tr>
                    </tbody>
                </table>
                <h2 className="p-4 pt-4 pb-2">Previous Holding Valuation</h2>
                <table className="table table-vcenter card-table">
                    <thead>
                        <tr>
                            <th>ETF Details</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.finalDataHoldingValuationPrevious && records.finalDataHoldingValuationPrevious.map((record) => (
                            <tr>
                                <td>{record.etf_details}</td>
                                <td>{record.valuation}</td>
                            </tr>
                        ))}
                        <tr>
                            <th className="text-end">Total</th>
                            <th>{records.finalDataHoldingValuationPrevious && records.finalDataHoldingValuationPrevious.length > 0 ? (parseFloat(sumOfValuesForKey(records.finalDataHoldingValuationPrevious,'valuation'))).toFixed(2) : 0}</th>
                        </tr>
                    </tbody>
                </table>
                <h2 className="p-4 pt-4 pb-2">Current Holding Valuation</h2>
                <table className="table table-vcenter card-table">
                    <thead>
                        <tr>
                            <th>ETF Details</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.finalDataHoldingValuationCurrent && records.finalDataHoldingValuationCurrent.map((record) => (
                            <tr>
                                <td>{record.etf_details}</td>
                                <td>{record.valuation}</td>
                            </tr>
                        ))}
                        <tr>
                            <th className="text-end">Total</th>
                            <th>{records.finalDataHoldingValuationCurrent && records.finalDataHoldingValuationCurrent.length > 0 ? (parseFloat(sumOfValuesForKey(records.finalDataHoldingValuationCurrent,'valuation'))).toFixed(2) : 0}</th>
                        </tr>
                    </tbody>
                </table>
                </>
            ) : (
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
                        {records && records.map((record) => (
                            <tr>
                                <td>{record.etf_details}</td>
                                <td>{record.buysell_date}</td>
                                <td>{record.buy_value}</td>
                                <td>{record.sell_value}</td>
                                <td>{record.buy_value-record.sell_value}</td>
                            </tr>
                        ))}
                        <tr>
                            <th className="text-end" colSpan={4}>Total</th>
                            <th>{records && records.length > 0 ? (parseFloat(sumOfValuesForKey(records,'buy_value')) - parseFloat(sumOfValuesForKey(records,'sell_value'))).toFixed(2) : 0}</th>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    </>
    )
}