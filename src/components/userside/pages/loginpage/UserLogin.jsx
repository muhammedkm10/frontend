import React, { useState, useEffect } from 'react'
import RegistatinNavbar from '../../layout/regnavbar'
import Registrationfooter from '../../layout/regfooter'
import loginimage from '../../../../assets/images/pexels-imagestudio-1488315.jpg'
import '../../../.././assets/css/custom-toastify.css'
import Userbutton from '../../common/Userbutton'
import Userinput from '../../common/Userinput'
import { Link, useAsyncError, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ClipLoader } from 'react-spinners'
import apiClient from '../../../../api/axiosconfig'
import { backendurls } from '../../../../api/backendEndpoints'

function UserLogin() {
  const notify = (data) =>
    toast.error(
      <div>
        <i className="fas  "></i>
        {data}
      </div>,
      {
        className: 'custom-toast',
        bodyClassName: 'custom-toast-body',
        progressClassName: 'custom-toast-progress',
      },
    )

  //  states using of the transition
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [])
  const blocked = useLocation()
  // useeffect for blocked users
  useEffect(() => {
    // Function to get query parameter
    const getQueryParam = (param) => {
      const urlParams = new URLSearchParams(blocked.search)
      return urlParams.get(param)
    }

    const message1 = getQueryParam('message')

    if (message1) {
      // Display the message
      setisinvalid('You are blocked')
    }
  }, [blocked])

  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  // to fetch the data from the previous component
  const location = useLocation()
  const { message } = location.state || {}

  // states used to store the  form data
  const [formData1, setFormdata1] = useState({
    email: '',
    password: '',
  })

  // validation for the enterd email and password
  const [isemailvalid, setisEmailvalid] = useState(false)
  const [ispasswordvalid, setidPasswordvalid] = useState(false)

  const handleemailandpassword = (e) => {
    const { name, value } = e.target
    setFormdata1({
      ...formData1,
      [name]: value,
    })
    if (name === 'email') {
      validateEmail(value)
    } else if (name === 'password') {
      validatePassword(value)
    }
  }

  const validateEmail = (value) => {
    const gmailRegex = /^[A-Za-z0-9]+@[A-Za-z0-9]+\.[A-Za-z]{2,}$/
    setisEmailvalid(gmailRegex.test(value))
  }
  const validatePassword = (value) => {
    setidPasswordvalid(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value));
  }

  const [loading, setLoading] = useState(false)
  const [isinvalid, setisinvalid] = useState('')
  const Navigate = useNavigate()
  const dispatch1 = useDispatch()

  // for submitting the form for login
  const submitHandler = async () => {
    if (!isemailvalid || !ispasswordvalid) {
      notify('Please enter valid password and email')
    } else {
      setLoading(true)
      try {
        const response = await apiClient.post(backendurls.loginurl, formData1)
        // if the response is success then the following code will work
        if (response.status === 200 && response.data.role === 'user') {
          setLoading(true)
          const resp = response.data
          apiClient
            .post(backendurls.accesstokenurl, formData1)
            .then((response) => {
              const p = response.data

              if (resp.role === 'user') {
                localStorage.setItem('authUserTokens', JSON.stringify(p))
                localStorage.setItem('user_id', resp.id)
                dispatch({
                  type: 'LOGIN SUCCESS',
                  payload: { usertoken: p, admintoken: null, role: resp.role },
                })
                // Navigate('/home')
                window.location.reload();
              }
            })
        } else {
          console.log('you are in an error', response)
        }
      } catch (error) {
        //  catching error from the backend and taking proper actions here
        if (error.response && error.response.data.error === 'notpresent') {
          setLoading(false)
          setisinvalid('enter currect email and password')
        } else if (error.response.data.error === 'blocked') {
          setLoading(false)
          setisinvalid('you are blocked')
        } else if (error.response.data.error === 'notverified') {
          setLoading(true)
          dispatch1({ type: 'SHOW OTP PAGE' })

          Navigate('/modal', { state: { email: formData1.email } })
        } else {
          console.log('not found',error)
        }
      }
    }
  }

  return (
    <div className="wrapper">
      <RegistatinNavbar />
      <main className="main">
        <div className="containerfluid">
          <div className="row innerwrapper">
            <div
              className={`col-md-6 d-none d-md-block firstside ${isVisible ? 'visible' : ''}`}
            >
              <img className="loginimage" src={loginimage} alt="Login" />
            </div>

            <div className="col-12 col-md-6 secondside">
              <ToastContainer position="top-center" />

              <div className={`login ${isVisible ? 'visible' : ''}`}>
                {message ? (
                  <div className="text-success">
                    <p>Verification completed please login....</p>
                  </div>
                ) : (
                  ''
                )}
                <h4 className="heading">Login</h4>
                <div className="loginform">
                  <div className="inputs">
                    <Userinput
                      placeholder="email"
                      type="email"
                      name="email"
                      onChange={handleemailandpassword}
                    />
                    {!formData1.email ||
                      (!isemailvalid && (
                        <div className="error">Invalid email</div>
                      ))}
                    <Userinput
                      placeholder="password"
                      type="password"
                      name="password"
                      onChange={handleemailandpassword}
                    />
                    {!formData1.password ||
                      (!ispasswordvalid && (
                        <div className="error">
                          {/* <p>Enter correct password</p> */}
                        </div>
                      ))}
                  </div>
                  <div className="loginbutton">
                    <Userbutton name="login" onClick={submitHandler} />
                  </div>
                  {loading ? (
                    <div className="spinner-container">
                      <ClipLoader
                        size={20}
                        color={'#123abc'}
                        loading={loading}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  {isinvalid && <p className="text-danger">{isinvalid}</p>}

                  <div className="links">
                    <span className="forget">
                      {' '}
                      {/* <Link>forget passwsord? </Link>|{' '} */}
                      <Link to="/usersignup">signup </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className={`footer-wrapper ${isVisible ? 'visible' : ''}`}>
        <Registrationfooter />
      </div>
    </div>
  )
}

export default UserLogin
