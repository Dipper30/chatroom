import React, { useEffect, useState } from 'react'
import './chatroom.scss'
import useChatSocket from '../hooks/useChatSocket'
import { withUser, formatUnixTSToString, getUID } from '../service/utils'
import './usermessage.scss'

interface IUserMessage {
  msg: any,
  user: any,
}

const UserMessage: React.FC<IUserMessage> = ({ msg, user }) => {
  
  const selfStyle = getUID() == user.id ? ' self' : ''
  return (
    <>
      {!selfStyle
        ? (
          <>
            <div className='user-row'>
              <div className='username'>
                {user.username}
              </div>
              <div className='time'>
                { formatUnixTSToString(msg.createTime) }
              </div>
            </div>
          </>)
        : (
          <>
            <div className={`user-row${selfStyle}`}>
              <div className={`time${selfStyle}`}>
                { formatUnixTSToString(msg.createTime) }
              </div>
              <div className={`username${selfStyle}`}>
                {user.username}
              </div>
            </div>
            
          </>)
      }
      <div className={`message${selfStyle}`}>
        <div className='inner'>
          { msg.content }
        </div>
      </div>
    </>
  )
}

export default UserMessage