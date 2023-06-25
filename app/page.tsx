'use client'
import useLogin from './hooks/useLogin';
import UserAccount from './components/UserAccount';
import GoodTable from './components/GoodTable';
import { AlertTriangle } from 'lucide-react';


export default function Home() {
  const login = useLogin();
  return (
    <main className="flex min-h-screen w-full flex-col sm:p-24 p-16 items-center">
      <div className={'flex flex-col max-w-3xl w-full'}>
        {
          // @ts-ignore This is for compatibility purposes
          (!document.createElement('dialog').showModal) ?
            <section className={'mb-6'}>
              <div className={'bg-yellow-400 shadow-xl shadow-amber-100 text-zinc-800 flex items-center gap-4 text-sm font-medium leading-6 p-4 rounded'}>
                <AlertTriangle size={20} />
                Your browser is unsupported. <br />
                Popup dialogs will not show up because your browser does not support native HTML dialog
              </div>
            </section> :
            null
        }
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
