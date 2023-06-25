'use client'
import useLogin from './hooks/useLogin';
import UserAccount from './components/UserAccount';
import GoodTable from './components/GoodTable';
import BrowserCompatibilityAlert from './components/BrowserCompatibilityAlert';

export default function Home() {
  const login = useLogin();
  return (
    <main className="flex min-h-screen w-full flex-col sm:p-24 p-16 items-center">
      <div className={'flex flex-col max-w-3xl w-full'}>
      <BrowserCompatibilityAlert />
        <section className={'mb-6'}>
          <UserAccount login={login} />
        </section>
        <section className={'mb-6'}>
          <GoodTable />
        </section>
      </div>
    </main>
  )
}
