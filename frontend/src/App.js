import { useState } from 'react'
import loginService from './services/login.js'
import registerService from './services/register.js'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import validator from 'validator'
import AlertBox from './components/Alert.js'

import {
  BrowserRouter as Router,
  Navigate,
  Routes,
  Route,
} from 'react-router-dom'

const App = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [passwordConf, setPasswordConf] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        email,
        password,
      })
      setUser(user)
      setEmail('')
      setPassword('')
    } catch (exc) {
      throwAlert('Incorrect email or password')
    }
  }

  const throwAlert = (msg) => {
    setAlertMessage(msg)
    setTimeout(() => {
      setAlertMessage('')
    }, 5000)
  }

  const handleRegistration = async (event) => {
    event.preventDefault()
    try {
      const isStrongPassword = validator.isStrongPassword(password, {
        minLength: 12,
        minLowercase: 1,
        minUpperCase: 1,
        minSymbols: 1,
      })

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      const isValidEmail = email.match(emailRegex)

      if (!name || !email || !password || !passwordConf) {
        throwAlert('Please fill out all fields.')
        return
      }

      if (!isValidEmail) {
        throwAlert('Please enter a valid email.')
        return
      }

      if (!isStrongPassword) {
        throwAlert(
          'Password must be atleast 12 characters long and must contain atleast 1 lowercase, uppercase, and special character each.'
        )
        return
      }

      if (password !== passwordConf) {
        throwAlert('Password fields must match.')
        return
      }

      const user = await registerService.register({
        email,
        password,
        name,
      })
      setUser(user)
      setEmail('')
      setPassword('')
      setName('')
      setPasswordConf('')
    } catch (exc) {
      console.log('name is', exc.name)
      if (
        exc.name === 'AxiosError' &&
        exc.response.data.error === 'Email already exists'
      ) {
        console.log(exc.response.data.error)
        throwAlert('This email is already registered.')
      } else {
        throwAlert('Something went wrong. Please try again in a few minutes.')
      }
    }
  }

  return (
    <div>
      <AlertBox msg={alertMessage} />
      <Router>
        <Routes>
          <Route
            path='/'
            element={
              user ? (
                <p>
                  If you want to see the sunshine, you have to weather the storm
                </p>
              ) : (
                <Navigate replace to='/login' />
              )
            }
          />

          <Route
            path='/login'
            element={
              user ? (
                <Navigate replace to='/' />
              ) : (
                <LoginForm
                  handleSubmit={handleLogin}
                  handleEmailChange={({ target }) => setEmail(target.value)}
                  handlePasswordChange={({ target }) =>
                    setPassword(target.value)
                  }
                  email={email}
                  password={password}
                />
              )
            }
          />
          <Route
            path='/register'
            element={
              user ? (
                <Navigate replace to='/' />
              ) : (
                <RegisterForm
                  handleSubmit={handleRegistration}
                  handleEmailChange={({ target }) => setEmail(target.value)}
                  handlePasswordChange={({ target }) =>
                    setPassword(target.value)
                  }
                  handlePasswordConfChange={({ target }) =>
                    setPasswordConf(target.value)
                  }
                  handleNameChange={({ target }) => setName(target.value)}
                  email={email}
                  password={password}
                  name={name}
                  passwordConf={passwordConf}
                />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  )
}

export default App
