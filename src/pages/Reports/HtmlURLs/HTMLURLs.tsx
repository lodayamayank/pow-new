import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import moment from 'moment'
import { ApplicationLayout, NoRecordsFoundMessage } from '@/components'
import { useNavigate } from 'react-router-dom'
import { getHTMLURLs } from '../core/_requests'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

function HTMLURLs() {
  const [records, setRecords] = useState<any[]>([])
  const [recordsFiltered, setRecordsFiltered] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCDN, setIsCDN] = useState<boolean>(false)
  const [clientCode, setClientCode] = useState<string>(null)
  const [reportType, setReportType] = useState<string>('all')
  const [reportDate, setReportDate] = useState<string>(moment().format("YYYY-MM-DD"))
  const navigate = useNavigate()
  async function loadURLs() {
    try {
      setIsLoading(true)
      const response = await getHTMLURLs()
      const pagination = response?.payload?.pagination || {};
      const recordsList = response?.data || [];
      setRecords(recordsList)
      setRecordsFiltered(recordsList.filter((rec) => rec.includes(reportDate.substring(0,7))))
      setIsLoading(false)
    } catch (error) {
      const err = error as AxiosError
      setIsLoading(false)
      return err
    }
  }


  useEffect(() => {
    loadURLs()
  }, [])

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
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">HTML Report URLs</h3>
                          <div className="card-actions">
                                <button 
                                type='button' 
                                onClick={() => setIsCDN(!isCDN)}
                                className={`btn ${isCDN ? 'btn-success' : 'btn-secondary'} d-none d-sm-inline-block`}>
                                  CDN: {isCDN ? 'ON' : 'OFF'}
                                </button>
                          </div>
                        </div>
                        <div className="card-body border-bottom py-3">
                          <div className="d-flex">
                            <select 
                            className="form-control form-select me-2 w-25"
                            onChange={(e) => {
                                setReportType(e.target.value)
                                const reportDateMonth = reportDate.substring(0,7)
                                if(e.target.value != "all"){
                                    if(clientCode != "" && clientCode != null){
                                        setRecordsFiltered(records.filter((rec) => rec.includes(clientCode) && rec.includes(e.target.value) && rec.includes(reportDateMonth)))
                                    }else{
                                        setRecordsFiltered(records.filter((rec) => rec.includes(e.target.value) && rec.includes(reportDateMonth)))
                                    }
                                }else{
                                    if(clientCode != "" && clientCode != null){
                                        setRecordsFiltered(records.filter((rec) => rec.includes(clientCode) && rec.includes(reportDateMonth)))
                                    }else{
                                        setRecordsFiltered(records.filter((rec) => rec.includes(reportDateMonth)))
                                    }
                                }
                            }}
                            defaultValue={reportType}
                            >
                                <option value="">Select Report</option>
                                    <option value="all">All</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                            </select>
                            <input type="date" className="form-control me-2 w-25" placeholder="YYYY-MM-DD"
                            defaultValue={reportDate}
                            onChange={(e) => {
                                setReportDate(e.target.value)
                                const reportDateMonth = e.target.value.substring(0,7)
                                if(reportType != "all"){
                                    if(clientCode != "" && clientCode != null){
                                        setRecordsFiltered(records.filter((rec) => rec.includes(clientCode) && rec.includes(reportDateMonth) && rec.includes(reportType)))
                                    }else{
                                        setRecordsFiltered(records.filter((rec) => rec.includes(reportDateMonth) && rec.includes(reportType)))
                                    }
                                }else{
                                    if(clientCode != "" && clientCode != null){
                                        setRecordsFiltered(records.filter((rec) => rec.includes(clientCode) && rec.includes(reportDateMonth)))
                                    }else{
                                        setRecordsFiltered(records.filter((rec) => rec.includes(reportDateMonth)))
                                    }
                                }
                            }}
                            />
                            <input 
                            type="text" 
                            id="table-search-records"
                            onChange={(e) => {
                                setClientCode(e.target.value)
                                const reportDateMonth = reportDate.substring(0,7)
                                if(reportType != "all"){
                                    if(e.target.value != "" && e.target.value != null){
                                        setRecordsFiltered(records.filter((rec) => rec.includes(reportDateMonth) && rec.includes(e.target.value) && rec.includes(reportType)))
                                    }else{
                                        setRecordsFiltered(records.filter((rec) => rec.includes(reportType) && rec.includes(reportDateMonth)))
                                    }
                                }else{
                                    if(e.target.value != "" && e.target.value != null){
                                        setRecordsFiltered(records.filter((rec) => rec.includes(e.target.value) && rec.includes(reportDateMonth)))
                                    }else{
                                        setRecordsFiltered(records.filter((rec) => rec.includes(reportDateMonth)))
                                    }
                                }
                            }}
                            className="form-control" 
                            placeholder="Enter client code" />
                          </div>
                        </div>
                        <div className="table-responsive">
                          <table className="table card-table table-vcenter text-nowrap datatable">
                            <thead>
                              <tr>
                                <th>Report URL</th>
                              </tr>
                            </thead>
                            <tbody>
                                {!isLoading && recordsFiltered?.length > 0 ? recordsFiltered.map((recordFiltered) => (
                                    <tr>
                                        <td><a href={`${isCDN ? process.env.DO_SPACES_BUCKET_CDN_URL.replace(".digital",".cdn.digital") : process.env.DO_SPACES_BUCKET_CDN_URL}${recordFiltered}?v=${moment().milliseconds()}`} target='_blank'>{recordFiltered.replace("reports/","")}</a></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td>No reports found</td>
                                    </tr>
                                )}
                            </tbody>
                          </table>
                        </div>
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

export default HTMLURLs
