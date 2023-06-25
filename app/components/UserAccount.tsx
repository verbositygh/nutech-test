import { useCallback, useEffect } from "react";
import useTyping from "../hooks/useTyping";
import { KeyRound, Loader2 } from "lucide-react";

const UserAccount = (props: { login: { sessionInfo: any, login: VoidFunction, logout: VoidFunction, isLoggingIn: boolean } }) => {
  const typing = useTyping('');
  const handleGenerateAndLogin = () => {
    props.login.login();
  }

  useEffect(() => {
    const sessionInfo = (props.login.sessionInfo as unknown as { [k: string]: any });    
    const sessionId = sessionInfo?.id;
    typing.changeTargetString(sessionId ?? '');
    typing.handleReplace();
  }, [props.login.sessionInfo]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <h1 className={'text-2xl font-bold mb-2'}>User Account</h1>
      <input className={'bg-white rounded border-gray-100 border-2 px-4 py-2 cursor-not-allowed placeholder:text-black'} name={'userId'} id={'userId'} value={typing.typed} disabled readOnly placeholder='Not Logged In' />
      <div className={'mt-2 mb-4 flex items-center gap-2'}>
        <button
          className={`btn px-4 py-2 rounded bg-indigo-800 text-white font-medium border-indigo-500 border-2 hover:border-indigo-400 hover:bg-indigo-700 focus:border-indigo-400 focus:bg-indigo-700 outline-0 relative`}
          disabled={typing.isTyping|| typing.isDeleting || props.login.isLoggingIn}
          onClick={handleGenerateAndLogin}>
          <div className={'absolute top-0 left-0 h-full w-full flex justify-center items-center'}>
            {
              typing.isTyping || typing.isDeleting || props.login.isLoggingIn ?
                <Loader2 className={'animate-spin'} size={20} /> :
                null
            }
          </div>
          <span className={`${typing.isTyping || typing.isDeleting || props.login.isLoggingIn ? 'opacity-0 cursor-not-allowed' : 'opacity-100'} flex items-center gap-2`}>
            <KeyRound size={20} />
            Generate Account and Login
          </span>
        </button>
        {
          props.login.sessionInfo && !typing.isTyping && !typing.isDeleting && !props.login.isLoggingIn ?
            <button className={'btn px-4 py-2 rounded bg-white text-red-800 border-gray-200 border-2 hover:border-gray-300 hover:bg-gray-100 hover:text-red-900 focus:border-gray-300 focus:bg-gray-100 focus:text-red-900 outline-0'} onClick={props.login.logout}>Logout</button> :
            null
        }
      </div>
      <div className={'text-sm text-red-700'}>
        Note:
        <div>
          To avoid abuse on the open internet, please generate and login to a new account. Session is not guaranteed to persist so please just regenerate if the page stops functioning.
        </div>
        <div>
          Database is server-side but the data are filtered per user.
        </div>
      </div>
    </>
  );
}

export default UserAccount;
