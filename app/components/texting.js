'use client'
import React, { useState } from 'react'

function Testing() {

    const [store, setStore] = useState([])
    const [formData, setFormData] = useState({ name:"", text: "", age: ""})



  return (
    <div>
        <form>
            <input type="text" value={formData.name} onChange={(e)=>setFormData(...formData, e.target.value)} ></input>
            <input type="text" value={formData.text} onChange={(e)=>setFormData(...formData, e.target.value)} ></input>
            <input type="text" value={formData.age} onChange={(e)=>setFormData(...formData, e.target.value)} ></input>
        </form>
    </div>
  )
}

export default Testing