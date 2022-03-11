/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react'
import './login.scss'
import api from '../request'
import { setUser } from '../store/actions/user'
import { connect } from 'react-redux'
import { handleResult } from '../service/utils' 
import { useNavigate } from 'react-router-dom'

const Login: React.FC = (props: any) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [lock, setLock] = useState(false)
  const navigate = useNavigate()

  let timer: any = null

  const login = async () => {
    if (lock) return
    setLock(true)
    // timeout after 1500ms
    timer = setTimeout(() => {
      setLock(false)
      clearTimeout(timer)
    }, 1500)
    const p = {
      username,
      password,
    }
    const res: any = await api.login(p)
    if (handleResult(res)) {
      props.setUser(res.data.user)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('uid', res.data.user.id)
      // go to chatroom
      navigate('/chat')
    }
    setLock(false)
    clearTimeout(timer)
  }

  const handleEnterKeyDown = (e: any): void => {
    if (e.code == 'Enter' && !lock) {
      login()
    }
  }

  // useEffect(() => {
  //   document.addEventListener('keydown', handleEnterKeyDown)
  //   return () => document.removeEventListener('keydown', handleEnterKeyDown)
  // }, [])

  return (
    <>
      <div className='login-container'>
        {/* {user?.username || 'no'} */}
        <div className='title'>Login</div>
        <div className='row'>
          <div className='label'>Username</div>
          <input autoFocus onKeyDown={handleEnterKeyDown} placeholder='Type username...' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} />
          <span className='count'>{password.length} / 12</span>
        </div>
        <div className='row'>
          <div className='label'>Password</div>
          <input onKeyDown={handleEnterKeyDown} type={'password'} placeholder='Type password...' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
          <span className='count'>{password.length} / 18</span>
        </div>
        <div className='desc'> Account will automatically be created for a new user.</div>
        <button onClick={login}> {'Go'} </button>
      </div>
    </>
  )
}

export default connect(
  (state: any) => ({
    user: state.user,
  }),
  {
    setUser,
  },
)(Login)
