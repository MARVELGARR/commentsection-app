import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }) {
    return (
        <html lang="en">
        <head>
          <title>Register</title>
          <body className={inter.className}>
            {children}
          </body>
        </head>
      </html>
    )
}