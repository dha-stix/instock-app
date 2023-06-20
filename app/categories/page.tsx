"use client"
import Header from "../dashboard/Header"
import SideNav from "../dashboard/SideNav"
import { FormEventHandler, useState, useCallback, useEffect } from "react"
import { auth } from '@/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import Loading from "../dashboard/Loading"
import { MdDeleteForever } from "react-icons/md"
import { deleteCategory, getCategories, addCategory } from '@/utils';

interface User {
    email: string | null,
    uid: string | null
}

interface Item {
    name: string,
    id: string,
    number_of_products: number
}

export default function Home() {
    const [user, setUser] = useState<User>()
    const [categoryName, setCategoryName] = useState<string>("")
    const [categories, setCategories] = useState([])
    const router = useRouter()

const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    addCategory(categoryName)
    setCategoryName("")
}
	const isUserLoggedIn = useCallback(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
                setUser({ email: user.email, uid: user.uid });
                getCategories(setCategories)
			} else {
				return router.push("/");
			}
		});
    }, [router]);
    
	useEffect(() => {
		isUserLoggedIn();
	}, [isUserLoggedIn]);

    if (!user?.email) return <Loading />
    
    return (
        <main className='flex w-full min-h-[100vh] relative'>
            <SideNav />
            
            <div className='md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]'>
                <Header title="Categories"/>

                   <section className="w-full mb-10">
                <h3 className="text-lg mb-4">Add Category</h3>
                    <form className="w-full flex items-center space-x-6" onSubmit={handleSubmit}>
                            <input className="border-b-[1px] px-4 py-2 w-1/2 rounded" 
                            type="text" 
                            placeholder="Category" 
                            name="name" id="name" 
                            required 
                            value={categoryName} 
                              onChange={e => setCategoryName(e.target.value)} 
                            />
                       
                        <button className="py-2 px-4 bg-blue-500 text-white rounded" type="submit">Add Category</button>
                    </form>
                </section>

                 <div className='w-full min-h-[30vh]'>
                   
                        <h3 className='text-xl'>Categories <span className='text-blue-300'>({categories?.length})</span></h3>
                       
                    <div>
                        {categories?.map((item: Item) =>(
                           <div className='w-full bg-white p-3 flex items-center justify-between rounded my-3' key={item.id}>
                            <p className='md:text-md text-sm'>{item.name}</p>
                            <div className="flex items-center space-x-5">
                                  
                                         <MdDeleteForever
                                        className="text-3xl text-red-500 cursor-pointer"
                                        onClick={() => deleteCategory(item.id, item.name)}    
                                    />
                            </div>
                            
                        </div>
          ))}            
                    </div>
                    
                </div>
            </div>
        </main>
    )
}