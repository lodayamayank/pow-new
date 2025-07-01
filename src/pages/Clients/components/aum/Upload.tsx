import { useState, useRef } from 'react'
import { CanAccess, Breadcrumbs, AlertMessage, ApplicationLayout, PageHeading } from '@/components'
import { useRoutePaths } from '@/hooks'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx';
import { uploadClientAUMsRecord } from '../../core/_requests';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}


function AUMs() {
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { CLIENTS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

   
    const [aumsItems, setAUMsItems] = useState([]);
    const [erroredAUMSsItems, setErroredAUMsItems] = useState([]);

    const fileInputRef = useRef(null);

    // Function to read and parse the file
    const handleAUMsFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const bufferArray = e.target.result;
                const workbook = XLSX.read(bufferArray, { type: 'buffer', cellDates: true, dateNF: 'dd-mm-yyyy' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                setAUMsItems(data);
            };

            reader.readAsArrayBuffer(file);
        }
    }

    // Function to handle the click of the custom button
    const handleAUMButtonClick = () => {
        // fileInputRef.current.click();
        if (fileInputRef.current) {
        fileInputRef.current.click();
        } else {
        console.error('File input ref is null');
        }
    }

  // Function to post data to an API
    const submitAums = async () => {
        setIsLoading(true)
        try {
        // console.log("adjsutmentsItems",adjsutmentsItems)
        const uploadResponse = await uploadClientAUMsRecord(aumsItems)
        if(uploadResponse?.status == 201 || uploadResponse?.status == 200){
            const erroredAUMsCodes = uploadResponse.data;
            setFormSubmitMsgType('success')
            if(erroredAUMsCodes.length > 0){
            setErroredAUMsItems(erroredAUMsCodes)
            setFormSubmitMsg("AUMs saved successfully but with errors with some of the Client Codes")
            }else{
            setAUMsItems([]); // Reset the items array
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset the file input
            }
            setFormSubmitMsg("AUMs saved successfully")
            }
        }else{
            setFormSubmitMsgType('error')
            setFormSubmitMsg(uploadResponse.data.message)
        }
        setIsLoading(false)
        } catch (error) {
        console.error('Error uploading AUMs data:', error);
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
        {title: 'Upload AUMs', path: '', isActive: true}
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
                                                        Upload Clients AUM
                                                        <Breadcrumbs links={breadCrumbs} />
                                                    </h3>
                                                    <div className="card-actions">
                                                        <a href={CLIENTS_PATH} className="btn me-2">Cancel</a>
                                                        <CanAccess permissions={['add_clients_aum']}>
                                                            <input
                                                            type="file"
                                                            accept=".xlsx, .xls"
                                                            style={{ display: 'none' }}
                                                            ref={fileInputRef}
                                                            onChange={handleAUMsFileUpload}
                                                            />
                                                            <button 
                                                            type='button' 
                                                            onClick={handleAUMButtonClick}
                                                            className="btn btn-outline-primary d-none d-sm-inline-block me-2">
                                                            Upload AUMs
                                                            </button>
                                                        </CanAccess>  
                                                    </div>
                                                </div>
                                                <div className="card-body border-bottom p-0">
                                                    {aumsItems.length > 0 && (
                                                    <table className='table'>
                                                        <thead>
                                                            <tr>
                                                                {Object.keys(aumsItems[0]).map((key) => (
                                                                    <th key={key} className='ps-4'>{key}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {erroredAUMSsItems && aumsItems.map((item, index) => (
                                                                <tr key={index}>
                                                                    {Object.values(item).map((val, idx) => {
                                                                    const errored = false
                                                                    if(idx == 0 && erroredAUMSsItems.includes(val)){
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
                                                {aumsItems.length > 0 && (
                                                    <div className="card-footer d-flex align-items-end">
                                                        <a href={CLIENTS_PATH} className="btn me-2">Cancel</a>
                                                        <button className='btn btn-primary me-2' onClick={submitAums}>Submit AUMs</button>
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

export default AUMs
