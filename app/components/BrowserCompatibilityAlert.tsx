import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

const BrowserCompatibilityAlert = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsBrowser(true)
    }
  }, []);
  return (
    // @ts-ignore This is for compatibility purposes
    (isBrowser && !document.createElement('dialog').showModal) ?
      <section className={'mb-6'}>
        <div className={'bg-yellow-400 shadow-xl shadow-amber-100 text-zinc-800 flex items-center gap-4 text-sm font-medium leading-6 p-4 rounded'}>
          <AlertTriangle size={20} />
          Your browser is unsupported. <br />
          Popup dialogs will not show up because your browser does not support native HTML dialog
        </div>
      </section> :
      null
  );
}

export default BrowserCompatibilityAlert;
