import './globals.css'
import { Inter } from 'next/font/google'
import Provider from './context/authContext/authContext'
import ToasterContex from './context/toasterContext/toasterContex'
const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Provider>
        <ToasterContex/>
          {children}
      </Provider>
      </body>
    </html>
  )
}
