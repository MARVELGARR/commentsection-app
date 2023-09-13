"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './context/authContext/authContext'
import ToasterContex from './context/toasterContext/toasterContex'
import { Provider } from 'react-redux'
import { store } from './redux/store'
const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Home</title>
        <body className={inter.className}>
        <Providers>
          <Provider store={store}>

            <ToasterContex/>
              {children}
          </Provider>  
        </Providers>
        </body>
      </head>
    </html>
  )
}
