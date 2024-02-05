import React from 'react'
import cl from "./loader.module.css"
export default function ({myHeight}) {
  return (
    <div style={{height:myHeight}} className={cl.container}>
      <div className={cl.loader}></div>
    </div>
    
  )
}
