import React, { useEffect, useState } from 'react'
import './notify.scss'

const Notify: React.FC = (props: any) => {

  return (
    <div id='notify' 
      className={ props.type ? 'n' : 'n ' + props.type }
    >
      <span> Notify: { props.message } </span>
    </div>
  )
}

export default Notify