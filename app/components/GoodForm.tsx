import { Loader2, Save, Upload, XCircle } from "lucide-react";
import React, { FC, FormEvent, useRef, useState } from "react";
import { z } from "zod";
import GoodValidation, { GoodFormValidation } from "../lib/validations/GoodValidation";
import { useAtom } from "jotai";
import { userAuth } from "../lib/atoms/login";

const GoodFormProps = z.intersection(
  z.discriminatedUnion('mode', [
    z.object({
      mode: z.literal('create'),
    }),
    z.object({
      mode: z.literal('update'),
      id: z.string(),
    })
  ]),
  z.object({
    data: GoodFormValidation,
    closeDialogHandler: z.function(),
    refetch: z.function().args(z.optional(z.object({
      throwOnError: z.boolean(),
      cancelRefetch: z.boolean(),
    }))),
  })
);

interface FormErrors {
  name?: string;
  buyingPrice?: string;
  sellingPrice?: string;
  stock?: string;
  itemImage?: string;
}

const GoodForm: FC<z.infer<typeof GoodFormProps>> = (props) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [imageInput, setImageInput] = useState<FileList | null>();
  const inputImageRef = useRef<HTMLInputElement>(null);
  const [changedData, setChangedData] = useState(props.data);
  const [userLogin] = useAtom(userAuth);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const matchDecimalNumber = (str: string) => {
    let newStr = '';
    const decPlace = str.indexOf('.');
    newStr = str.match(/[0-9]*/g)?.join('') ?? '';
    if (decPlace != -1) {
      newStr = newStr.substring(0, decPlace) + '.' + newStr.substring(decPlace, newStr.length);
    }
    return newStr;
  }
  const getImageBase64 = () => {
    return new Promise<string>((resolve, reject) => {
      if (!imageInput?.[0]) {
        reject('Image file does not exist');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(imageInput[0]);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject('Image processing failed');
    })
  }
  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    setIsSaving(true);
    event.preventDefault();
    setFormErrors({});
    let b64Img = '';
    try {
      b64Img = await getImageBase64();
    } catch (e) {
      if (e === 'Image file does not exist' && !changedData.image) {
        setFormErrors(errs => ({ ...errs, itemImage: `${errs.itemImage ?? ''}\n${e ?? 'Image processing failed'}` }))
      }
    }
    const payload = {
      ...changedData,
      buyingPrice: Number(changedData.buyingPrice),
      sellingPrice: Number(changedData.sellingPrice),
      stock: Number(changedData.stock),
      image: (!imageInput && changedData.image ? changedData.image : b64Img) ?? changedData.image,
      userId: '',
    }
    const validationResult = GoodValidation.safeParse(payload);
    if (!validationResult.success) {
      setIsSaving(false);
      for (const err of validationResult.error.errors) {
        if (err.path.includes('name')) {
          setFormErrors(errs => ({ ...errs, name: `${errs.name ?? ''}\n${err.message}` }))
        }
        if (err.path.includes('buyingPrice')) {
          setFormErrors(errs => ({ ...errs, buyingPrice: `${errs.buyingPrice ?? ''}\n${err.message}` }))
        }
        if (err.path.includes('sellingPrice')) {
          setFormErrors(errs => ({ ...errs, sellingPrice: `${errs.sellingPrice ?? ''}\n${err.message}` }))
        }
        if (err.path.includes('stock')) {
          setFormErrors(errs => ({ ...errs, stock: `${errs.stock ?? ''}\n${err.message}` }))
        }
        if (err.path.includes('image')) {
          setFormErrors(errs => ({ ...errs, itemImage: `${errs.stock ?? ''}\n${err.message}` }))
        }
      }
      return;
    }
    const fetchResult = await fetch('/api/goods', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${userLogin?.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const fetchBody = await fetchResult.json();
    if (!fetchResult.ok && fetchBody.error.meta.target.includes('name')) {
      setFormErrors(errs => ({...errs, name: `${errs.name ?? ''}\nName probably already exists`}))
    } else {
      props.refetch(undefined);
      props.closeDialogHandler();
    }
    setIsSaving(false);
  }
  const handleCancel = async () => {
    setChangedData(props.data);
    setImageInput(null);
    props.closeDialogHandler();
  }
  const handleClearFile = (ev?: FormEvent<HTMLButtonElement>) => {
    ev?.preventDefault();
    if (!inputImageRef.current?.files) {
      return;
    }
    inputImageRef.current.files = null;
    inputImageRef.current.value = '';
    setImageInput(null);
  }
  const handleChangeImage = () => {
    if (!inputImageRef.current?.files?.length) {
      setImageInput(null);
      return;
    }
    if (inputImageRef.current.files[0].size > 100_000) {
      setFormErrors(err => ({
        ...err,
        itemImage: 'File size exceeds 100KB limit'
      }));
      setImageInput(null);
      return;
    }
    if (!['image/jpg', 'image/jpeg', 'image/png'].includes(inputImageRef.current.files[0].type)) {
      console.log(inputImageRef.current.files[0])
      setFormErrors(err => ({
        ...err,
        itemImage: 'File type is not JPEG or PNG'
      }));
      setImageInput(null);
      return;
    }
    setFormErrors(err => ({
      ...err,
      itemImage: undefined
    }));
    setImageInput(inputImageRef.current?.files ?? null)
  }
  return (
    <>
      <h1 className={'text-2xl font-bold mb-2'}>Form - {props.mode === 'update' ? `Update #${props.data.id}` : 'Create'}</h1>
      <form onSubmit={handleSave}>
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium leading-6 text-gray-900'} htmlFor="item-name">Name</label>
          <input
            className={'block bg-white rounded border-gray-200 border-2 px-4 py-2 focus:border-indigo-400 active:border-indigo-400 outline-0 focus:shadow-xl focus:shadow-indigo-50 text-sm'}
            name={'item-name'}
            id={'item-name'}
            type={'text'}
            placeholder={'Item Name'}
            value={changedData.name}
            onChange={(v) => { setChangedData(prev => ({ ...prev, name: v.target.value })) }}
          />
          <div className={'h-4 text-xs leading-6 text-red-600'}>
            {
              formErrors.name ?? null
            }
          </div>
        </div>
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium leading-6 text-gray-900'} htmlFor={'item-buying-price'}>Buying Price</label>
          <input
            className={'block bg-white rounded border-gray-200 border-2 px-4 py-2 focus:border-indigo-400 active:border-indigo-400 outline-0 focus:shadow-xl focus:shadow-indigo-50 text-sm'}
            name={'item-buying-price'}
            id={'item-buying-price'}
            type={'text'}
            placeholder={'0.00'}
            value={changedData.buyingPrice}
            onChange={(v) => { setChangedData(prev => ({ ...prev, buyingPrice: matchDecimalNumber(v.target.value) })) }}
          />
          <div className={'h-4 text-xs leading-6 text-red-600'}>
            {
              formErrors.buyingPrice ?? null
            }
          </div>
        </div>
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium leading-6 text-gray-900'} htmlFor={'item-selling-price'}>Selling Price</label>
          <input
            className={'block bg-white rounded border-gray-200 border-2 px-4 py-2 focus:border-indigo-400 active:border-indigo-400 outline-0 focus:shadow-xl focus:shadow-indigo-50 text-sm'}
            name={'item-selling-price'}
            id={'item-selling-price'}
            type={'text'}
            placeholder={'0.00'}
            value={changedData.sellingPrice}
            onChange={(v) => { setChangedData(prev => ({ ...prev, sellingPrice: matchDecimalNumber(v.target.value) })) }}
          />
          <div className={'h-4 text-xs leading-6 text-red-600'}>
            {
              formErrors.sellingPrice ?? null
            }
          </div>
        </div>
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium leading-6 text-gray-900'} htmlFor={'item-stock'}>Stock</label>
          <input
            className={'block bg-white rounded border-gray-200 border-2 px-4 py-2 focus:border-indigo-400 active:border-indigo-400 outline-0 focus:shadow-xl focus:shadow-indigo-50 text-sm'}
            name={'item-stock'}
            id={'item-stock'}
            type={'text'}
            placeholder={'0'}
            value={changedData.stock}
            onChange={(v) => { setChangedData(prev => ({ ...prev, stock: v.target.value.match(/[0-9]*/g)?.[0] ?? '' })) }}
          />
          <div className={'h-4 text-xs leading-6 text-red-600'}>
            {
              formErrors.stock ?? null
            }
          </div>
        </div>
        <div className={'mb-4'}>
          <label className={'block text-sm font-medium leading-6 text-gray-900'} htmlFor={'item-image'}>Picture</label>
          <div className={'overflow-hidden relative'}>
            <div className={'flex align-center gap-2 bg-white rounded border-gray-200 border-2 px-4 py-2 focus:border-indigo-400 active:border-indigo-400 outline-0 focus:shadow-xl focus:shadow-indigo-50 text-sm text-gray-900'}>
              <Upload className={'inline'} size={20} />
              {
                imageInput?.length ?
                  <>
                    File selected: {imageInput?.[0]?.name}
                    <button className={'z-20'} onClick={handleClearFile}>
                      <XCircle size={20} />
                    </button>
                  </> :
                  'Select a file'
              }
            </div>
            <input
              ref={inputImageRef}
              name={'item-image'}
              id={'item-image'}
              className={'block absolute bg-white rounded opacity-0 top-0 left-0 h-full cursor-pointer z-10'}
              type={'file'}
              accept={'image/(jpg|jpeg|png)'}
              onChange={handleChangeImage}
            />
          </div>
          <div className={'text-xs leading-6 text-gray-500'}>
            MAX 100KB JPEG or PNG File
          </div>
          <div className={'h-4 text-xs leading-6 text-red-600'}>
            {
              formErrors.itemImage ?? null
            }
          </div>
        </div>

        <div className={'flex items-center gap-2'}>
          <button
            className={`btn px-4 py-2 rounded bg-indigo-800 text-white font-medium border-indigo-500 border-2 hover:border-indigo-400 hover:bg-indigo-700 focus:border-indigo-400 focus:bg-indigo-700 outline-0 relative flex items-center gap-2`}
            type={'submit'}
          >
            <div className={'absolute top-0 left-0 h-full w-full flex justify-center items-center'}>
              {
                isSaving ?
                  <Loader2 className={'animate-spin'} size={20} /> :
                  null
              }
            </div>
            <span className={`${isSaving ? 'opacity-0 cursor-not-allowed' : 'opacity-100'} flex items-center gap-2`}>
              <Save size={20} />
              Save
            </span>
          </button>
          {
            !isSaving ?
              <button
                className={'btn px-4 py-2 rounded bg-white text-red-800 border-gray-200 border-2 hover:border-gray-300 hover:bg-gray-100 hover:text-red-900 focus:border-gray-300 focus:bg-gray-100 focus:text-red-900 outline-0 flex items-center'}
                onClick={handleCancel}
              >
                Cancel
              </button> :
              null
          }
        </div>

      </form>
    </>
  );
}

export default GoodForm;
