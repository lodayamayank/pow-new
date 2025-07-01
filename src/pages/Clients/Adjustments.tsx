import { AxiosError } from 'axios'
import { useEffect, useState, Fragment, useRef } from 'react'
import { Client, detailsInitValues as initialValues } from './core/_models'
import { createRecord, uploadClientAdjustmentsRecord } from './core/_requests'
import { CanAccess, Breadcrumbs, AlertMessage, ApplicationLayout, PageHeading } from '@/components'
import { useRoutePaths } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import { CrudForm } from './components'
import * as XLSX from 'xlsx';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}


function Adjustments() {
    const [data, setData] = useState<Client>(initialValues)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { CLIENTS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

   
    const [adjsutmentsItems, setAdjsutmentsItems] = useState([]);
    const [erroredAdjsutmentsItems, setErroredAdjsutmentsItems] = useState([]);

    const fileInputRef = useRef(null);

    // Function to read and parse the file
    const handleAdjustmentsFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const bufferArray = e.target.result;
                const workbook = XLSX.read(bufferArray, { type: 'buffer', cellDates: true, dateNF: 'dd-mm-yyyy' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                setAdjsutmentsItems(data);
            };

            reader.readAsArrayBuffer(file);
        }
    }

    // Function to handle the click of the custom button
    const handleAdjustmentButtonClick = () => {
        // fileInputRef.current.click();
        if (fileInputRef.current) {
        fileInputRef.current.click();
        } else {
        console.error('File input ref is null');
        }
    }

  // Function to post data to an API
    const submitAdjustments = async () => {
        setIsLoading(true)
        try {
        // console.log("adjsutmentsItems",adjsutmentsItems)
        const uploadResponse = await uploadClientAdjustmentsRecord(adjsutmentsItems)
        if(uploadResponse?.status == 201 || uploadResponse?.status == 200){
            const erroredAdjustmentsCodes = uploadResponse.data;
            setFormSubmitMsgType('success')
            if(erroredAdjustmentsCodes.length > 0){
            setErroredAdjsutmentsItems(erroredAdjustmentsCodes)
            setFormSubmitMsg("Adjustments saved successfully but with errors with some of the Client Codes")
            }else{
            setAdjsutmentsItems([]); // Reset the items array
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset the file input
            }
            setFormSubmitMsg("Adjustments saved successfully")
            }
        }else{
            setFormSubmitMsgType('error')
            setFormSubmitMsg(uploadResponse.data.message)
        }
        setIsLoading(false)
        } catch (error) {
        console.error('Error uploading adjustments data:', error);
        setIsLoading(false)
        }
    }

    function formatDate(date) {
        if (!(date instanceof Date)) return date;
        let day = ('0' + date.getDate()).slice(-2);
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const breadCrumbs = [
        {title: 'Clients', path: CLIENTS_PATH, isActive: false},
        {title: 'Upload Adjustments', path: '', isActive: true}
    ]

    return (
        <>
        <ApplicationLayout>
            <main>
                <div className="page-body">
                    <div className="container-xl">
                        <div className=" mx-auto">
                            <div className="flex flex-col">
                                <div className="-m-1.5 overflow-x-auto">
                                    <div className="p-1 min-w-full inline-block align-middle">
                                        <div className="col-12">
                                            {formSubmitMsg && (<AlertMessage setFormSubmitMsg={setFormSubmitMsg} alertType={formSubmitMsgType} alertMessage={formSubmitMsg} />)}
                                            <div className="card">
                                                <div className="card-header">
                                                    <h3 className="card-title">
                                                        Upload Clients Adjustment
                                                        <Breadcrumbs links={breadCrumbs} />
                                                    </h3>
                                                    <div className="card-actions">
                                                        <a href={CLIENTS_PATH} className="btn me-2">Cancel</a>
                                                        <CanAccess permissions={['upload_clients_adjustments']}>
                                                            <input
                                                            type="file"
                                                            accept=".xlsx, .xls"
                                                            style={{ display: 'none' }}
                                                            ref={fileInputRef}
                                                            onChange={handleAdjustmentsFileUpload}
                                                            />
                                                            <button 
                                                            type='button' 
                                                            onClick={handleAdjustmentButtonClick}
                                                            className="btn btn-outline-primary d-none d-sm-inline-block me-2">
                                                            Upload Adjustments
                                                            </button>
                                                        </CanAccess>  
                                                    </div>
                                                </div>
                                                <div className="card-body border-bottom p-0">
                                                    {adjsutmentsItems.length > 0 && (
                                                    <table className='table'>
                                                        <thead>
                                                            <tr>
                                                                {Object.keys(adjsutmentsItems[0]).map((key) => (
                                                                    <th key={key} className='ps-4'>{key}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {erroredAdjsutmentsItems && adjsutmentsItems.map((item, index) => (
                                                                <tr key={index}>
                                                                    {Object.values(item).map((val, idx) => {
                                                                    const errored = false
                                                                    if(idx == 0 && erroredAdjsutmentsItems.includes(val)){
                                                                        return (
                                                                        <td key={idx} className='ps-4 text-danger'>{formatDate(val)} <br/> Error</td>
                                                                        )
                                                                    }
                                                                    return (
                                                                        <td key={idx} className='ps-4'>{formatDate(val)}</td>
                                                                    )
                                                                    })}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    )}
                                                </div>
                                                {adjsutmentsItems.length > 0 && (
                                                    <div className="card-footer d-flex align-items-end">
                                                        <a href={CLIENTS_PATH} className="btn me-2">Cancel</a>
                                                        <button className='btn btn-primary me-2' onClick={submitAdjustments}>Submit Adjustments</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ApplicationLayout>
        </>
    )
}

export default Adjustments
