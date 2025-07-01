import { useEffect, useState, Fragment } from 'react'
import { Permission, Role, initialRole, roleDetailsInitValues as initialValues } from './core/_models'
import { assignPermissions, createRecord } from './core/_requests'
import { useRoutePaths } from '@/hooks'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { useNavigate } from 'react-router-dom'
import { AlertMessage } from '@/components'
import Accordion from 'react-bootstrap/Accordion';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const roleSchema = Yup.object().shape({
    permissions: Yup.array().required('Select atleast one permission')
})
export type Props = {
    role: Role
    permissions: Permission[]
}

function RoleAccordion(props: Props) {
    const {role, permissions} = props
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { USERS_PATH } = useRoutePaths()
    const navigate = useNavigate()
    const [formSubmitMsg, setFormSubmitMsg] = useState<string>()
    const [formSubmitMsgType, setFormSubmitMsgType] = useState<string>('error')
    const [initialValues, setInitialValues] = useState<Role>({
        id: role.id,
        permissions: role.permissions.map((permission: Permission) => permission.id),
    })

    const [currentRolePermissions, setCurrentRolePermissions] = useState<number[]>(role.permissions.map((item: Permission) => item.id))

    const handleChangeLocal = (e: any) => {
        // Destructuring
        const { value, checked } = e.target;
        if (checked) {
            setCurrentRolePermissions([...currentRolePermissions, parseInt(value)]);
        } else {
            const updatedPermissions = currentRolePermissions.filter((permId: number) => {
                return permId != value
            })
            setCurrentRolePermissions(updatedPermissions);
        }
        // onChange(currentRolePermissions)
    }

    const formik = useFormik<Role>({
        initialValues,
        validationSchema: roleSchema,
        onSubmit: async (values) => {
        setIsLoading(true)
        try {
            const roleId = role.id
            values.permissions = currentRolePermissions
            const respData = await assignPermissions(values, roleId)

            setIsLoading(false)
            if(respData?.status == 201 || respData?.status == 200){
                setFormSubmitMsgType('success')
                setFormSubmitMsg("Role permissions updated successfully")
                setIsLoading(false)
                // setTimeout(() => {
                // navigate(0)
                // }, 1000)
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
        {formSubmitMsg && (<AlertMessage setFormSubmitMsg={setFormSubmitMsg} alertType={formSubmitMsgType} alertMessage={formSubmitMsg} />)}
        <form onSubmit={formik.handleSubmit} className='form relative' autoComplete="none">
        <Accordion className='mb-2'>
            <Accordion.Item className='border-none' eventKey={String(role.id)}>
                <Accordion.Header className='p-0 border-0 font-bold'>
                {role.name}
                </Accordion.Header>
                <Accordion.Body>
                {permissions.length > 0 && permissions.map((permissionItem: Permission) => (
                        <label className="form-check form-check-inline">
                            <input 
                                key={`flexSwitch${permissionItem.id}`}
                                className="form-check-input" 
                                type="checkbox"
                                {...formik.getFieldProps('permissions')}
                                value={permissionItem.id} 
                                id={`permissioninput_${permissionItem.id}`}
                                defaultChecked={role.permissions.some((rolePermission: Permission) => rolePermission.id === permissionItem.id)} 
                                onChange={handleChangeLocal}
                                />
                            <span className="form-check-label">{permissionItem.name?.split("_").join(" ").toUpperCase()}</span>
                        </label>
                    ))}
                    {role.name != 'Admdin' && (
                        <div className="mt-5 flex justify-center gap-x-2">
                            <button type="submit" className="btn btn-primary">
                                Update Role Permissions
                            </button>
                        </div>
                    )}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
        </form>
        </>
    )
}

export default RoleAccordion
