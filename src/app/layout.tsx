
import Nav from '../../components/nav'
import './globals.css'

export const metadata = {
  title: 'My Chat UI',
  description: 'A UI connected to Colab backend',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav/>
        <main>{children}</main>
        </body>
    </html>
  )
}