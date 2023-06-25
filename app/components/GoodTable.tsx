import { Edit, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import GoodValidation, { GoodFormValidation } from "../lib/validations/GoodValidation";
import GoodForm from "./GoodForm";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { userAuth } from "../lib/atoms/login";
import debounce from 'lodash.debounce';

const emptyForm = {
  name: '',
  sellingPrice: '',
  buyingPrice: '',
  image: '',
  stock: '',
}
type FormMode = 'create' | 'update'

const QueryReturnType = z.object({
  data: z.array(GoodValidation),
  perPage: z.number().int(),
  pages: z.number().int(),
  currentPage: z.number().int(),
});

const GoodTable = () => {
  const [userLogin] = useAtom(userAuth);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isDialogSpawned, setIsDialogSpawned] = useState<boolean>(false);
  const [isDeleteDialogSpawned, setIsDeleteDialogSpawned] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const formDialog = useRef<HTMLDialogElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [formId, setFormId] = useState('');
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [formData, setFormData] = useState<z.infer<typeof GoodFormValidation>>(emptyForm);
  const [pages, setPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1);

  const searchDebouncer = debounce(v => setDebouncedSearch(v), 200);

  const {
    isLoading,
    data,
    refetch,
  } = useQuery<z.infer<typeof QueryReturnType>, Error>({
    queryKey: [userLogin, 'goods', debouncedSearch, currentPage],
    queryFn: async () => {
      const fetchResult = await fetch('/api/goods?' + new URLSearchParams({
        page: currentPage.toString(),
        search: debouncedSearch,
      }).toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userLogin?.token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!fetchResult.ok) {
        throw new Error('Something went wrong');
      }
      const jsonResult = await fetchResult.json();
      setPages(jsonResult.pages);
      setCurrentPage(jsonResult.currentPage);
      return jsonResult;
    },
    enabled: (userLogin?.token ? true : false),
  })

  const handleClearSearch = () => {
    setSearch('');
  }
  const handleOpenDialog = (mode: FormMode, data: z.infer<typeof GoodFormValidation>, id?: string) => {
    setIsDialogSpawned(true);
    setFormMode(mode);
    setFormData(data);
    setFormId(id ?? '');
  }
  const handleCloseDialog = () => {
    setIsDialogSpawned(false)
    setFormMode('create');
    setFormData(emptyForm);
    setFormId('');
  }
  const handleOpenDeleteDialog = (id: string) => {
    setToDelete(id);
    setIsDeleteDialogSpawned(true);
  }
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogSpawned(false);
    setToDelete(null);
  }
  const handleDeletion = async () => {
    setIsDeleting(true);
    await fetch('/api/goods/delete', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userLogin?.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: toDelete,
      })
    });
    refetch();
    handleCloseDeleteDialog();
    setIsDeleting(false);
  }
  useEffect(() => {
    if (isDialogSpawned) {
      formDialog.current?.showModal();
      return;
    }
    formDialog.current?.close();
  }, [isDialogSpawned])
  useEffect(() => {
    if (isDeleteDialogSpawned) {
      deleteDialog.current?.showModal();
      return;
    }
    deleteDialog.current?.close();
  }, [isDeleteDialogSpawned])
  useEffect(() => {
    searchDebouncer(search);
  }, [search, searchDebouncer]);
  return (
    <>
      {
        isDialogSpawned ?
          <dialog open={false} ref={formDialog} className={'rounded p-8 shadow-2xl'}>
            <GoodForm mode={formMode} data={formData} id={formId} closeDialogHandler={handleCloseDialog} refetch={refetch} />
          </dialog> : null
      }
      {
        isDeleteDialogSpawned ?
          <dialog open={false} ref={deleteDialog} className={'rounded p-8 shadow-2xl'}>
            <h1 className={'text-gray-900 leading-6 mb-4 text-lg'}>
              Confirm Deletion of {toDelete}
            </h1>
            <div className={'mt-6 flex gap-2'}>
              <button
                className={'relative btn px-4 py-2 rounded bg-red-700 text-white border-gray-200 border-2 hover:border-red-300 hover:bg-red-800 hover:text-white focus:border-red-300 focus:bg-red-800 focus:text-white outline-0'}
                onClick={handleDeletion}
                disabled={isDeleting}
              >
                <div className={'absolute top-0 left-0 h-full w-full flex justify-center items-center'}>
                  {
                    isDeleting ?
                      <Loader2 className={'animate-spin'} size={20} /> :
                      null
                  }
                </div>
                <span className={`${isDeleting ? 'opacity-0 cursor-not-allowed' : 'opacity-100'} flex items-center gap-2`}>
                  <Trash2 size={20} />
                  Confirm Delete
                </span>
              </button>
              {
                !isDeleting ?
                  <button
                    className={'relative btn px-4 py-2 rounded bg-white text-indigo-800 border-gray-200 border-2 hover:border-gray-300 hover:bg-gray-100 hover:text-indigo-900 focus:border-gray-300 focus:bg-gray-100 focus:text-indigo-900 outline-0'}
                    onClick={handleCloseDeleteDialog}
                  >
                    Cancel
                  </button> :
                  null
              }
            </div>
          </dialog> : null
      }
      <div className={'flex justify-between items-center'}>
        <h1 className={'text-2xl font-bold mb-2'}>Goods</h1>
        <button
          onClick={() => handleOpenDialog('create', emptyForm)}
          className={`btn px-4 py-2 rounded bg-indigo-800 text-white font-medium border-indigo-500 mr-2 mb-2 border-2 hover:border-indigo-400 hover:bg-indigo-700 focus:border-indigo-400 focus:bg-indigo-700 outline-0 relative flex items-center gap-2`}
        >
          <Plus size={20} />
          New
        </button>
      </div>
      <div className={'relative'}>
        <div className={'absolute left-3 top-0 h-full flex items-center text-gray-600'}>
          <Search size={20} />
        </div>
        {
          search ?
            <button
              className={'absolute right-3 top-0 h-full flex items-center text-gray-600'}
              onClick={handleClearSearch}
            >
              <X size={20} />
            </button> : null
        }
        <input
          className={'block bg-white rounded border-gray-200 border-2 px-4 pl-10 pr-10 py-2 focus:border-indigo-400 active:border-indigo-400 outline-0 focus:shadow-xl focus:shadow-indigo-50 text-sm'}
          name={'search'}
          id={'search'}
          type={'text'}
          placeholder={'Search item name'}
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </div>
      <div className={'mt-4 rounded overflow-auto shadow-xl shadow-indigo-50'}>
        <table className={'w-full text-left'}>
          <thead className={'bg-gray-200 text-sm font-bold'}>
            <tr className={'text-gray-600'}>
              {
                ['Name', 'Image', 'Buying Price', 'Selling Price', 'Stock', 'Actions'].map(text => (
                  <th key={text} className={'text-start py-4 px-4'}>{text}</th>
                ))
              }
            </tr>
          </thead>
          <tbody className={'text-sm text-gray-700'}>
            {
              !data?.data.length ? (
                <tr className={'w-full h-16 leading-6 text-center text-sm text-gray-700 overflow-hidden'}>
                  <td colSpan={1000} className={'overflow-hidden'}>
                    {
                      isLoading ?
                        <Loader2 size={20} className={'animate-spin w-full flex justify-center'} /> :
                        <span>There is no data in this table</span>
                    }
                  </td>
                </tr>
              ) :
                data.data.map((g, i) => (
                  <tr key={g.id} className={`bg-white border-b ${i % 2 ? 'border-b-gray-200' : 'border-b-gray-50'}`}>
                    <td className={'py-4 px-4'}>{g.name}</td>
                    <td className={'py-4 px-4'}><img className={'h-12'} src={g.image ?? ''} alt={`${g.name} image`} /></td>
                    <td className={'py-4 px-4'}>{g.buyingPrice}</td>
                    <td className={'py-4 px-4'}>{g.sellingPrice}</td>
                    <td className={'py-4 px-4'}>{g.stock}</td>
                    <td className={'py-4 px-4 align-middle'}>
                      <div className={'flex gap-2'}>
                        <button onClick={() => handleOpenDialog('update', g, g.id)}><Edit size={20} /></button>
                        <button onClick={() => handleOpenDeleteDialog(g.id as string)}><Trash2 size={20} /></button>
                      </div>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
      <div className={'mt-8 flex justify-center'}>
        {
          [...Array(pages)].map((_, p) => (
            <button
              key={p}
              className={`w-8 h-8 rounded p-2 text-sm flex items-center justify-center ${p + 1 != currentPage ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'shadow-xl shadow-indigo-100 border-indigo-200 bg-indigo-600 text-indigo-50'}`}
              disabled={p + 1 == currentPage}
              onClick={() => setCurrentPage(p + 1)}
            >
              {p + 1}
            </button>
          ))
        }
      </div>
    </>
  );
}

export default GoodTable;

