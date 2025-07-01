import { useEffect, useState, Fragment } from 'react'
import { ServicePermission, detailsServicePermissionInitValues as initialValues } from '../core/_models'
// import { assignPermissions, createRecord } from './core/_requests'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useNavigate } from 'react-router-dom'
import AlertMessage from '@/components/AlertMessage/AlertMessage'
import { Service } from '../core/_models'
import { Button, Modal } from 'flowbite-react';
import { createServicePermission } from '../core/_requests'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const permissionSchema = Yup.object().shape({
    name: Yup.string().required('Enter permission name')
})
export type Props = {
    service: Service
}

function AddNewPermission(props: Props) {
    const { service } = props
    // const {role, permissions} = props
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { USERS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

    const formik = useFormik<ServicePermission>({
        initialValues,
        validationSchema: permissionSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            if(service && service.uuid){
                const respData = await createServicePermission(values, service.uuid)
                setIsLoading(false)
                if(respData?.status == 201 || respData?.status == 200){
                    setFormSubmitMsgType('success')
                    setFormSubmitMsg("Service permissions added successfully")
                    setIsLoading(false)
                    setTimeout(() => {
                    navigate(0)
                    }, 1000)
                }else{
                    setFormSubmitMsgType('error')
                    setFormSubmitMsg(respData.data.message)
                }
            }
        } catch (error) {
            setIsLoading(false)
        }
        },
    })
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                <div></div>
                <div>
                    <Button onClick={() => setOpenModal(true)} className='text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Add New Permission</Button>
                </div>
            </div>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <form onSubmit={formik.handleSubmit} className='form relative' autoComplete="none">
                <Modal.Header>Add New Permission</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        {formSubmitMsg && (<AlertMessage alertType={formSubmitMsgType} alertMessage={formSubmitMsg} />)}
                        <div className="grid gap-4 mb-4 grid-cols-2">
                            <div className="col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input 
                                    {...formik.getFieldProps('name')}
                                    type="text" 
                                    id="name" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
                                {formik.touched.name && formik.errors.name && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.name}</p>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                <textarea 
                                    {...formik.getFieldProps('description')}
                                    id="description" 
                                    // @ts-ignore
                                    rows="4" 
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></textarea>
                                {formik.touched.description && formik.errors.description && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.description}</p>
                                )}
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="default_active" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Default Active</label>
                                <input
                                    {...formik.getFieldProps('default_active')}
                                    className='form-check-input w-45px h-30px'
                                    type='checkbox'
                                    id='default_active'
                                    defaultChecked={initialValues.default_active}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                    type='submit' 
                    className='text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                        Save
                    </Button>
                    <Button onClick={() => setOpenModal(false)} type='button' className='inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'>Close</Button>
                </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default AddNewPermission