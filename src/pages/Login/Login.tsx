import React, { FormEvent, useEffect, useState } from 'react'
import { useRoutePaths, useSession } from '@/hooks'
import AlertMessage from '@/components/AlertMessage/AlertMessage'

function initialFormValues() {
  return {
    email: '',
    password: ''
  }
}

function Login() {
  const [values, setValues] = useState(initialFormValues)
  const [loginRequestStatus, setLoginRequestStatus] = useState('success')
  const { signIn } = useSession()
  const { REGISTER_PATH } = useRoutePaths()
  const [errMsg, setErrMsg] = useState('')

  function handleUserChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const user = event.target.value
    setValues(JSON.parse(user))
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setValues({
      ...values,
      [name]: value
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    setLoginRequestStatus('loading')

    try {
      const signin = await signIn(values)
      console.log("signin",signin)
      if(signin["code"] !== undefined){
        setErrMsg(signin["message"])
      }else{
        setErrMsg(signin?.response?.data?.message)
      }
      // @ts-ignore
      
    } catch (error) {
      /**
       * an error handler can be added here
       */
      console.log("error",error);
    } finally {
      setLoginRequestStatus('success')
    }
  }

  useEffect(() => {
    // clean the function to prevent memory leak
    return () => setLoginRequestStatus('success')
  }, [])

  return (
    <>
    <div className="page page-center">
      <div className="container container-tight py-4">
        <div className="text-center mb-4">
          <a href="." className="navbar-brand navbar-brand-autodark">
            POW-CRM
          </a>
        </div>
        <div className="card card-md">
          <div className="card-body">
            <h2 className="h2 text-center mb-4">Login to your account</h2>
            {errMsg && (
              <div className='pt-2'>
                <AlertMessage alertMessage={errMsg} alertType='error' />
              </div>
            )}
            <form className="space-y-0" method='post' onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor='email' className="form-label">Email address</label>
                <input type="email" id="email" name="email" className="form-control" required aria-describedby="email-error"
                  disabled={loginRequestStatus === 'loading'}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label" htmlFor='password'>
                  Password
                  <span className="form-label-description">
                    <a href="./forgot-password.html">I forgot password</a>
                  </span>
                </label>
                <div className="input-group input-group-flat">
                  <input type="password" id="password" name="password" className="form-control" required aria-describedby="password-error"
                    disabled={loginRequestStatus === 'loading'}
                    onChange={handleChange}
                  />
                  {/* <span className="input-group-text">
                    <a href="#" className="link-secondary" title="Show password" data-bs-toggle="tooltip">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                    </a>
                  </span> */}
                </div>
              </div>
              <div className="mb-2">
                <label className="form-check">
                  <input type="checkbox" className="form-check-input"/>
                  <span className="form-check-label">Remember me on this device</span>
                </label>
              </div>
              <div className="form-footer">
                <button type="submit" className="btn btn-primary w-100">Sign in</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login
