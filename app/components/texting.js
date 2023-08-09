'use client'
import React, { useState } from 'react'

function Testing() {

    const [store, setStore] = useState([])

    const students = [
        { id:1, name: 'John', email: 'john@example.com', age: 13, sex: 'male', score: 1 },
        { id:2, name: 'wale', email: 'wale@example.com', age: 23, sex: 'female', score: 2 },
        { id:3, name: 'kunle', email: 'kunle@example.com', age: 14, sex: 'male', score: 5 },
        { id:4, name: 'tunde', email: 'tunde@example.com', age: 43, sex: 'male', score: 4 },
        { id:5, name: 'tule', email: 'tule@example.com', age: 33, sex: 'male', score: 6 },
        { id:6, name: 'edozie', email: 'edozie@example.com', age: 23, sex: 'female', score: 7 },
        { id:7, name: 'fugazi', email: 'fugazi@example.com', age: 63, sex: 'male', score: 3 },
        { id:8, name: 'icadi', email: 'icadi@example.com', age: 73, sex: 'male', score: 5 },
        { id:9, name: 'ronaldo', email: 'ronaldo@example.com', age: 93, sex: 'female', score: 9 },
        { id:10, name: 'biyaro', email: 'biyaro@example.com', age: 13, sex: 'male', score: 3 },
        { id:11, name: 'phonni', email: 'phonni@example.com', age: 43, sex: 'female', score: 21 },
    ]

    const run = () => {
        const answer = students.filter((student)=>{
            return(
                student.age === 13
            )
        }).map((student)=>{
            return(
               <></> 
            )
        })
        setStore(answer)
        console.log(store)
    }

  return (
    <div>
        <button onClick={run} className="b-2 bg-slate-600 text-white">submit</button>
    </div>
  )
}

export default Testing