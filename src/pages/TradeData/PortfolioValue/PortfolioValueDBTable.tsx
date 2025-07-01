import moment from "moment";
import React, { useEffect, useState } from "react";

type Props = {
    children?: React.ReactNode
    records: any
}

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function PortfolioValueDBTable(props: Props) {
    const { children, records } = props
    const [totalValue, setTotalValue] = useState(0)
    function sumOfValuesForKey(arr, key) {
        return arr.reduce((sum, obj) => {
            return sum + obj[key];
        }, 0);
    }
    // if(records && records.length > 0){
    //     const lastEntryDate = records[records.length-1]["entryDate"]
    //     let total = 0
    //     records.forEach(element => {
    //         if(element.entryDate == lastEntryDate){
    //             total += element.holdingValue
    //         }
    //     });
    //     setTotalValue(total)
    // }

    function calcTotalValue(){
        if(records && records.length > 0){
            const lastEntryDate = records[records.length-1]["entryDate"]
            let total = 0
            records.forEach(element => {
                if(element.entryDate == lastEntryDate){
                    total += element.holdingValue
                }
            });
            setTotalValue(total)
        }
    }

    useEffect(() => {
        calcTotalValue()
    }, ["records"])
    
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
                            <td className=" text-nowrap">{moment(record.entryDate).format("DD-MM-YYYY")}</td>
                            <td>{record.isin}</td>
                            <td>{record.isinName}</td>
                            <td>{parseFloat(record.quantity).toFixed(0)}</td>
                            <td>{Number(parseFloat(record.holdingValue).toFixed(2)).toLocaleString("en-IN")}</td>
                            <td>{record.balanceType}</td>
                        </tr>
                    ))}
                    <tr>
                        <th colSpan={4} className="text-end">Total Holding Value</th>
                        <th colSpan={2}>{totalValue && Number(totalValue.toFixed(2)).toLocaleString("en-IN")}</th>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
    )
}