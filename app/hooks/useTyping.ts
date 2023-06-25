import { useRef, useState } from "react";

const useTyping = (str: string) => {
  const targetString = useRef(str);
  const [typed, setTyped] = useState('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  let typingDelay: number | undefined;
  let resettingDelay: number | undefined;
  const removeDelay = () => {
    if (typingDelay != undefined) {
      clearTimeout(typingDelay);
      typingDelay = undefined;
    }
    if (resettingDelay != undefined) {
      clearTimeout(resettingDelay);
      resettingDelay = undefined;
    }
  }
  const handleTyping = () => {
    return new Promise<void>((resolve, reject) => {
      if (isTyping) {
        reject();
        console.warn('Typing is already started')
        return;
      }
      removeDelay();
      setIsDeleting(false);
      setIsTyping(true);
      const len = targetString.current.length;
      let cursor = 0;
      let typingType = 'alnum';
      const type = () => { setTyped(targetString.current.substring(0, cursor + 1)); ++cursor };
      const runType = () => {
        if (cursor >= len) {
          setIsTyping(false);
          resolve();
          return;
        }
        const isAlnum = targetString.current[cursor].match(/[ A-Za-z0-9]/);
        const delay = isAlnum && typingType === 'alnum' ? 100 + Math.random() * 160 : 400 + Math.random() * 600;
        typingType = isAlnum ? 'alnum' : 'special';
        typingDelay = setTimeout(() => { type(); runType(); }, delay) as unknown as number;
      }
      runType();
    })
  }
  const handleReset = () => {
    return new Promise<void>((resolve, reject) => {
      if (isDeleting) {
        console.warn('Deletion is already started')
        reject();
        return;
      }
      removeDelay();
      setIsTyping(false);
      setIsDeleting(true);
      const fromString = typed;
      const len = typed.length;
      let cursor = len;
      const del = () => { setTyped(fromString.substring(0, cursor)); --cursor };
      const runDel = () => {
        if (cursor < 0) {
          setIsDeleting(false)
          resolve();
          return;
        }
        resettingDelay = setTimeout(() => { del(); runDel() }, 20 + Math.random() * 40) as unknown as number;
      }
      runDel();
    })
  }
  const handleReplace = async () => {
    try {
      await handleReset();
      await handleTyping();
      removeDelay();
    } catch (e) {
      // There's a re-run but it's okay
    }
  }
  const changeTargetString = (str: string) => {
    targetString.current = str;
  }

  return { typed, isTyping, isDeleting, handleTyping, handleReset, handleReplace, changeTargetString };
}

export default useTyping;
