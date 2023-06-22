"use client"
import React, { useState, useCallback, useEffect } from 'react'
import AddNew from './AddNew'
import SideNav from './SideNav'
import Link from 'next/link'
import Header from './Header'
import { auth } from '@/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import Loading from './Loading'
import { Sales, getCategories, getProducts, getSales, getTotalSales, User } from '@/utils'

    
export default function Dashboard() {
    const [addNew, setAddNew] = useState<boolean>(false)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [totalSales, setTotalSales] = useState<number>(0)
    const [sales, setSales] = useState<Sales[]>([])
    const openModal = () => setAddNew(true)
    const [user, setUser] = useState<User>()
    const router = useRouter()
    
	const isUserLoggedIn = useCallback(() => {
		onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser({ email: user.email, uid: user.uid });
                const promises = [getProducts(setProducts), getCategories(setCategories), getTotalSales(setTotalSales), getSales(setSales)];
                await Promise.all(promises);
                
			} else {
				return router.push("/");
			}
		});
	}, [router]);

	useEffect(() => {
        isUserLoggedIn();
	}, [isUserLoggedIn]);

    if(!user?.email) return <Loading/>
    return (
        <main className='flex w-full min-h-[100vh] relative'>
          <SideNav/>
            
            <div className='md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]'>
                <Header title='Dashboard' />
               
                <div className='flex items-center md:flex-row flex-col justify-between w-full md:space-x-4 mb-8'>
                    <div className='bg-white md:w-1/3 w-full h-[200px] shadow rounded p-3 hover:shadow-lg md:my-auto my-2'>
                        <h3 className='text-[#9AA8BD] mb-10'>Total Sales</h3>
                        <h2 className='text-center font-bold text-3xl text-[#60A9CD]'>₦{totalSales.toLocaleString()}</h2>
                    </div>
                    <div className='bg-white md:w-1/3 w-full h-[200px] shadow rounded p-3 hover:shadow-lg md:my-auto my-2'>
                        <h3 className='text-[#9AA8BD] mb-10'>Products</h3>
                        <h2 className='text-center font-bold text-3xl text-[#8FCA37]'>{products.length}</h2>
                    </div>
                    <div className='bg-white md:w-1/3 w-full h-[200px] shadow rounded p-3 hover:shadow-lg md:my-auto my-2'>
                        <h3 className='text-[#9AA8BD] mb-10'>Categories</h3>
                        <h2 className='text-center font-bold text-3xl text-red-300'>{categories.length}</h2>
                    </div>
                </div>

                <div className='w-full min-h-[30vh]'>
                    <div className='flex items-center justify-between mb-6'>
                        <h3 className='text-xl'>Recent Sales</h3>
                        <button className='px-4 py-2 bg-blue-500 text-white rounded' onClick={openModal} >Add New</button>
                    </div>
                    <div>
                        {sales.map((sale: Sales) => (
                            <div className='w-full bg-white p-3 flex items-center justify-between rounded my-3' key={sale.id}>
                                <p className='md:text-md text-sm'>Order{" "}
                                    <span className='text-blue-300'>
                                        #{sale.id}
                                    </span>
                                </p>
                            <Link href="/sales" className='px-4 py-2 bg-[#D64979] text-white text-sm rounded'>Details</Link>
                        </div>
                        ))}
                        
                        
                    </div>
                    
                </div>

            </div>
            {addNew && <AddNew setAddNew={setAddNew} productsArray={products} />}
        </main>
    )
}
