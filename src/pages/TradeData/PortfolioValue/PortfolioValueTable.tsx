import React from "react";

type Props = {
    children?: React.ReactNode
    records: any
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function PortfolioValueTable(props: Props) {
    const { children, records } = props
    function sumOfValuesForKey(arr, key) {
        return arr.reduce((sum, obj) => {
            return sum + obj[key];
        }, 0);
    }
    
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
                        <th>ISIN</th>
                        <th>ISIN Name</th>
                        <th>Qty</th>
                        <th>Holding Value</th>
                        <th>Balance Type</th>
                    </tr>
                </thead>
                <tbody>
                    {records && records.map((record) => (
                        <tr>
                            <td className=" text-nowrap">{record.date}</td>
                            <td>{record.isin}</td>
                            <td>{record.isin_name}</td>
                            <td>{parseFloat(record.qty).toFixed(0)}</td>
                            <td>{parseFloat(record.holding_value).toFixed(2)}</td>
                            <td>{record.balance_type}</td>
                        </tr>
                    ))}
                    <tr>
                        <th colSpan={4} className="text-end">Total Holding Value</th>
                        <th colSpan={2}>{parseFloat(sumOfValuesForKey(records,'holding_value')).toFixed(2)}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
    )
}