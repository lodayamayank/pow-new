import { AxiosError } from 'axios'
import { useEffect, useState, Fragment } from 'react'
import { Client, detailsInitValues as initialValues } from './core/_models'
import { updateRecord, getRecordById } from './core/_requests'
import { CanAccess, Breadcrumbs, Loader, AlertMessage, ApplicationLayout } from '@/components'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { ClientAUMLanding, ClientBrokerLanding, ClientCommercialsList, ClientPlatformsList, ClientProfitsLanding, ClientStrategiesList, ClientSubscriptionsList, CrudForm, TaskList } from './components'
import moment from 'moment'
import { ClientAdjustmentsLanding } from './components/adjustments'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

const recordDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    mobile: Yup.number().required('Mobile is required'),
    email: Yup.string().email().required('Email is required'),
    dob: Yup.date().max(new Date(), "Date of birth must be in the past").min(eighteenYearsAgo, "You must be at least 18 years old").required("Date of birth is required"),
    nomineeName: Yup.string().required('Nominee Name is required'),
    pan: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN must be in format AAAAA9999A').required('PAN is required'),
})


function Details() {
    const { id } = useParams()
    const [data, setData] = useState<Client>(initialValues)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentTab, setCurrentTab] = useState<string>('brokers')
    const [currentTabAction, setCurrentTabAction] = useState<string>('brokers-list')
    const { CLIENTS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

    const formik = useFormik<Client>({
        initialValues,
        validationSchema: recordDetailsSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            const respData = await updateRecord(values, data && data.uuid ? data.uuid : id)
            setIsLoading(false)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Record updated successfully")
                setTimeout(() => {
                    navigate(CLIENTS_PATH)
                }, 1000)
            }else{
                setFormSubmitMsgType('error')
                setFormSubmitMsg(respData.data.message)
            }
        } catch (error) {
            setIsLoading(false)
        }
        },
    })



    useEffect(() => {
        async function loadRecord(uuid: string) {
          try {
            setIsLoading(true)
            const response = await getRecordById(uuid)
            if(response){
                formik.setFieldValue('name', response.name)
                formik.setFieldValue('mobile', response.mobile)
                formik.setFieldValue('email', response.email)
                formik.setFieldValue('pan', response.pan)
                formik.setFieldValue('dob', response.dob)
                formik.setFieldValue('nomineeName', response.nomineeName)
                formik.setFieldValue('description', response.description)
                formik.setFieldValue('is_active', response.is_active)
                setData(response)
            }
            setIsLoading(false)
          } catch (error) {
            const err = error as AxiosError
            setIsLoading(false)
            return err
          }
        }
        loadRecord(id ? id : '')
    }, [])

    const breadCrumbs = [
        {title: 'Clients', path: CLIENTS_PATH, isActive: false},
        {title: `Client Details: ${data ? data.name : ''}`, path: '', isActive: true}
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
                                            <div className="card">
                                                <div className="card-header">
                                                    <h3 className="card-title">
                                                        Client Details: {data ? data.name : ''}
                                                        <Breadcrumbs links={breadCrumbs} />
                                                    </h3>
                                                    <div className="card-actions">
                                                        <a href={CLIENTS_PATH} className="btn btn-sm me-2">Back to clients</a>
                                                    </div>
                                                </div>
                                                <div className="card-body border-bottom p-0">
                                                    <div className='py-3 bg-light'>
                                                    <table className="table card-table table-vcenter text-nowrap datatable">
                                                        <tr>
                                                            <td>
                                                                <div className="d-flex py-1 align-items-center">
                                                                <span className="avatar me-2">{data.name[0]}</span>
                                                                <div className="flex-fill">
                                                                    <div className="font-weight-medium">{data.name}</div>
                                                                    <div className="text-secondary fs-6"><span className="text-reset">{data.mobile},<br/> {data.email}</span></div>
                                                                </div>
                                                                </div>
                                                            </td>
                                                            <td>{data.pan}</td>
                                                            <td>{moment(data.dob).format("D MMM YYYY")}</td>
                                                            <td>{data.nomineeName}</td>
                                                            <td>
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">{data.persistable ? moment(data.persistable?.created_at).format("D MMM YYYY") : ''}</span>
                                                            </td>
                                                            <td>
                                                                {data.weeklyReport && (
                                                                <div><span className="badge bg-success me-1"></span> Weekly Report</div> 
                                                                )}
                                                            </td>
                                                            <td>
                                                                {data.is_active ? (
                                                                <div><span className="badge bg-success me-1"></span> Active</div> 
                                                                ) : (
                                                                <div><span className="badge bg-danger me-1"></span> Inactive</div>
                                                                )}
                                                            </td>
                                                            <td className='text-end'>
                                                                <CanAccess permissions={['update_clients']}>
                                                                    <button type='button'
                                                                    className='btn btn-icon btn-outline-primary'
                                                                    onClick={() => navigate(`/clients/update/${data.uuid}`)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                                        <path d="M16 5l3 3" />
                                                                        </svg>
                                                                    </button>
                                                                </CanAccess>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    </div>
                                                    <div className=''>
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <ul className="nav nav-tabs card-header-tabs nav-fill" data-bs-toggle="tabs" role="tablist">
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('brokers')}
                                                                    >
                                                                        <span className={`nav-link ${currentTab == "brokers" ? 'active' : ''}`} data-bs-toggle="tab" aria-selected="true" role="tab">Broker Accounts</span>
                                                                    </li>
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('platforms')}
                                                                    >
                                                                        <span className={`nav-link ${currentTab == "platforms" ? 'active' : ''}`}>Platforms</span>
                                                                    </li>
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('aum')}
                                                                    >
                                                                        <a href="#tabs-profile-6" className={`nav-link ${currentTab == "aum" ? 'active' : ''}`}>AUM</a>
                                                                    </li>
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('profits')}
                                                                    >
                                                                        <a href="#tabs-profile-6" className={`nav-link ${currentTab == "profits" ? 'active' : ''}`}>Profits Settled</a>
                                                                    </li>
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('adjustments')}
                                                                    >
                                                                        <a href="#tabs-profile-6" className={`nav-link ${currentTab == "adjustments" ? 'active' : ''}`}>Adjustments</a>
                                                                    </li>
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('strategies')}
                                                                    >
                                                                        <a href="#tabs-profile-6" className={`nav-link ${currentTab == "strategies" ? 'active' : ''}`}>Strategies</a>
                                                                    </li>
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('commercials')}
                                                                    >
                                                                        <a href="#tabs-profile-6" className={`nav-link ${currentTab == "commercials" ? 'active' : ''}`}>Commercials</a>
                                                                    </li>
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('subscriptions')}
                                                                    >
                                                                        <a href="#tabs-profile-6" className={`nav-link ${currentTab == "subscriptions" ? 'active' : ''}`}>Subscriptions</a>
                                                                    </li>
                                                                    <li 
                                                                    className="nav-item cursor-pointer" 
                                                                    role="presentation"
                                                                    onClick={() => setCurrentTab('tasks')}
                                                                    >
                                                                        <a href="#tabs-profile-6" className={`nav-link ${currentTab == "tasks" ? 'active' : ''}`}>Tasks</a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            {data && (
                                                                <div>
                                                                    {currentTab == "brokers" && (
                                                                        <div className='card-body p-0'>
                                                                            <ClientBrokerLanding clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                    {currentTab == "platforms" && (
                                                                        <div className='card-body'>
                                                                            <ClientPlatformsList clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                    {currentTab == "aum" && (
                                                                        <div className='card-body p-0'>
                                                                            <ClientAUMLanding clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                    {currentTab == "profits" && (
                                                                        <div className='card-body p-0'>
                                                                            <ClientProfitsLanding clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                    {currentTab == "adjustments" && (
                                                                        <div className='card-body p-0'>
                                                                            <ClientAdjustmentsLanding clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                    {currentTab == "strategies" && (
                                                                        <div className='card-body'>
                                                                            <ClientStrategiesList clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                    {currentTab == "commercials" && (
                                                                        <div className='card-body'>
                                                                            <ClientCommercialsList clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                    {currentTab == "subscriptions" && (
                                                                        <div className='card-body'>
                                                                            <ClientSubscriptionsList clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                    {currentTab == "tasks" && (
                                                                        <div className='card-body'>
                                                                            <TaskList clientId={data.uuid} />
                                                                        </div>    
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer d-flex align-items-end">
                                                    <a href={CLIENTS_PATH} className="btn me-2">Back to clients</a>
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

export default Details