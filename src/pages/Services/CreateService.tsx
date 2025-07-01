import { useEffect, useState, Fragment } from 'react'
import { Service, detailsInitValues as initialValues } from './core/_models'
import { createRecord } from './core/_requests'
import { CanAccess, Breadcrumbs, AlertMessage } from '@/components'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useNavigate } from 'react-router-dom'


function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const serviceDetailsSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Code is required'),
})

function CreateService() {
    const [data, setData] = useState<Service>(initialValues)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { SERVICES_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')

    const formik = useFormik<Service>({
        initialValues,
        validationSchema: serviceDetailsSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            for (let value in values) {
                formData.append(value, values[value]);
            }
            // @ts-ignore
            const respData = await createRecord(formData)
            setIsLoading(false)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Record added successfully")
                setTimeout(() => {
                    navigate(SERVICES_PATH)
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


    return (
        <>
            <main>
                {formSubmitMsg && (<AlertMessage alertType={formSubmitMsgType} alertMessage={formSubmitMsg} />)}
                <form onSubmit={formik.handleSubmit} className='form relative' encType='multipart/form-data'>
                    <div className="max-w-[80rem] p-8 mx-auto">
                        <div className="flex flex-col">
                            <div className="-m-1.5 overflow-x-auto">
                                <div className="p-1 min-w-full inline-block align-middle">
                                    <div className="bg-white shadow border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                                        <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                                    Create Service
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <Breadcrumbs links={[{title: 'Services', path: SERVICES_PATH, isActive: false},{ title: 'Create New Service', path: '', isActive: true}]} />
                                                </p>
                                            </div>

                                            <div>
                                                <div className="mt-6 flex items-center justify-end gap-x-6">
                                                <a href={SERVICES_PATH} className="text-sm font-semibold leading-6 text-gray-900">Cancel</a>
                                                <button 
                                                    type='submit' 
                                                    className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600' 
                                                    disabled={isLoading}>
                                                    {!isLoading && 'Save'}
                                                    {isLoading && 'Please wait...'}
                                                </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-12 px-8">
                                            <div className="pb-8">
                                                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                                                        <div className="mt-2">
                                                            <input
                                                                autoComplete='off'
                                                                type='text'
                                                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                                                {...formik.getFieldProps('name')}
                                                            />
                                                            {formik.touched.name && formik.errors.name && (
                                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.name}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">Code</label>
                                                        <div className="mt-2">
                                                            <input
                                                                autoComplete='off'
                                                                type='text'
                                                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                                                                {...formik.getFieldProps('code')}
                                                            />
                                                            {formik.touched.code && formik.errors.code && (
                                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.code}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">Image</label>
                                                        <div className="mt-2">
                                                            <input 
                                                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                                                                aria-describedby="file_input_help" 
                                                                id="image" 
                                                                type="file"
                                                                // {...formik.getFieldProps('image')}
                                                                accept='image/*'
                                                                onChange={(e) =>
                                                                    formik.setFieldValue('image', e.currentTarget.files ? e.currentTarget.files[0] : null)
                                                                }
                                                            />
                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
                                                            {formik.touched.code && formik.errors.code && (
                                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.code}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-span-full">
                                                        <label htmlFor="svg_icon" className="block text-sm font-medium leading-6 text-gray-900">SVG Icon</label>
                                                        <div className="mt-2">
                                                            <input
                                                            type="text"
                                                            {...formik.getFieldProps('svg_icon')}
                                                            autoComplete="street-address"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                            {formik.touched.svg_icon && formik.errors.svg_icon && (
                                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.svg_icon}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="col-span-full">
                                                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                                                        <div className="mt-2">
                                                            <input
                                                            type="text"
                                                            {...formik.getFieldProps('description')}
                                                            autoComplete="street-address"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                            />
                                                            {formik.touched.description && formik.errors.description && (
                                                            <p className="mt-2 text-sm text-red-600 dark:text-red-500">{formik.errors.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="is_active" className="block text-sm font-medium leading-6 text-gray-900">Is Active?</label>
                                                        <div className="mt-2">
                                                            <input
                                                                {...formik.getFieldProps('is_active')}
                                                                className='form-check-input w-45px h-30px'
                                                                type='checkbox'
                                                                id='is_active'
                                                                // @ts-ignore
                                                                defaultChecked={initialValues.is_active}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-3">
                                                        <label htmlFor="default_active" className="block text-sm font-medium leading-6 text-gray-900">Default Active?</label>
                                                        <div className="mt-2">
                                                            <input
                                                                {...formik.getFieldProps('default_active')}
                                                                className='form-check-input w-45px h-30px'
                                                                type='checkbox'
                                                                id='default_active'
                                                                // @ts-ignore
                                                                defaultChecked={initialValues.default_active}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-gray-200 bg-white px-6 py-4">
                                        {/* <div className='flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4 gap-3'> */}
                                            <div className="mt-5 flex justify-end gap-x-2">
                                                <a href={SERVICES_PATH} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                Cancel
                                                </a>
                                                <button 
                                                    type='submit' 
                                                    className='py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600' 
                                                    disabled={isLoading}>
                                                    {!isLoading && 'Save'}
                                                    {isLoading && 'Please wait...'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}

export default CreateService
