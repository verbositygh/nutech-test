import './globals.css'
import { Inter } from 'next/font/google'
import { Provider } from 'jotai';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nutech Test',
  description: 'Nutech test by Louis Raymond Prawira',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
