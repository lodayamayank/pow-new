import { useEffect, useState, Fragment } from 'react'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useNavigate } from 'react-router-dom'
import AlertMessage from '@/components/AlertMessage/AlertMessage'
import { Service, ServicePermission } from '../core/_models'
import { Button, Modal } from 'flowbite-react';
import AddNewPermission from './AddNewPermission'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const roleSchema = Yup.object().shape({
    permissions: Yup.array().required('Select atleast one permission')
})
export type Props = {
    service: Service
}

function ServicePermissions(props: Props) {
    const {service } = props
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { USERS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')
    const [initialValues, setInitialValues] = useState<Service>({
        id: 1,
        // permissions: [],
    })

    

    const formik = useFormik<any>({
        initialValues,
        validationSchema: roleSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            // const respData = await assignPermissions(values, roleId)
            // let respData.status = 0
            setIsLoading(false)
            // if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Role permissions updated successfully")
                setIsLoading(false)
                setTimeout(() => {
                navigate(0)
                }, 1000)
            // }else{
            //     setFormSubmitMsgType('error')
            //     setFormSubmitMsg(respData.data.message)
            // }
        } catch (error) {
            setIsLoading(false)
        }
        },
    })
    const [openModal, setOpenModal] = useState(false);



    return (
        <>
            <AddNewPermission service={service} />
            {service.servicePermissions && service.servicePermissions.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>    
                        <th scope="col" className="px-6 py-3 text-start">
                            <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                Name
                            </span>
                            </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                            <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                Description
                            </span>
                            </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                            <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                Default Active?
                            </span>
                            </div>
                        </th>
                    </tr>
                </thead>
    
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {service.servicePermissions?.length > 0 ? (
                    service.servicePermissions.map((record: ServicePermission) => (
                    <tr className="bg-white hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                        <td className="h-px w-px whitespace-nowrap">
                            <div className="ps-6 lg:ps-3 pe-6 py-3">
                                <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">{record.name}</span>
                            </div>
                        </td>
                        <td className="h-px w-px whitespace-nowrap">
                            <div className="px-6 py-2">
                            {record.description}
                            </div>
                        </td>
                        <td className="h-px w-px whitespace-nowrap">
                            <div className="px-6 py-2">
                            { record.default_active ? (
                                <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                                </svg>
                                Yes
                                </span>
                            ) : (
                                <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-red-100 text-red-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                                <svg className="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                                </svg>
                                No
                                </span>
                            )}
                            </div>
                        </td>
                    </tr>
                ))) : (<></>)}

                </tbody>
                </table>
            )}
        </>
    )
}

export default ServicePermissions