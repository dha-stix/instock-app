"use client"
import SideNav from "../dashboard/SideNav"
import { BsFillPrinterFill, BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Header from "../dashboard/Header";
import React, { useState, useCallback, useEffect } from "react"
import { auth } from '@/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import Loading from "../dashboard/Loading"
import { Sales, getSales, getSalesForDay } from "@/utils";
import { Collapse } from "react-collapse";

interface User {
    email: string | null,
    uid: string | null
}

export default function Sales() {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [sales, setSales] = useState([])
    const [user, setUser] = useState<User>()
    const router = useRouter()
    const [clicked, setClicked] = useState<number>()

    const toggleClick = (index: number) => {
        if (clicked == index) {
            return setClicked(0); 
        }
        setClicked(index)
        
    }
    
	const isUserLoggedIn = useCallback(() => {
		onAuthStateChanged(auth, (user) => {
            if (user) {
                getSales(setSales)
               setUser({ email: user.email, uid: user.uid });
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
                <Header title="Sales"/>

                <section className="flex items-center justify-between mb-8">
                    <h3 className="text-lg">Recent Sales</h3>
                    <div className="flex items-center justify-between space-x-6">
                        <DatePicker
										selectsEnd={true}
										selected={selectedDate}
										required
                            onChange={(date) => {
                                setSelectedDate(date)
                                getSalesForDay(date, setSales)
                            }}
										endDate={selectedDate}
										maxDate={date}
										className='border-[1px] w-full py-2 px-4 rounded-md '
									/>
                    </div>
                    
                </section>

                <div>
                    {sales.map((sale: Sales, index: any) => (
                          <div className="w-full my-3 cursor-pointer" key={sale.id} onClick={() => toggleClick(index)}>
                        <div className='w-full bg-white py-3 px-6 flex items-center justify-between rounded  border-b-[1px] border-b-gray-200'>
                            <p className='md:text-md text-sm'>Order <span className='text-blue-300'>#{sale.id}</span></p>
                                <button className='px-4 py-2 bg-[#D64979] text-white text-sm rounded' onClick={() => toggleClick(index)}>{clicked === index ? <BsFillCaretUpFill/> : <BsFillCaretDownFill/> }</button>
                            
                        </div>
<Collapse isOpened={clicked === index}>
                            
                        <div className="min-h-[200px] w-full bg-white py-4 flex flex-col space-y-2 px-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-500">Customer: {sale.customerName}</p>
                            <p className="text-sm text-gray-500">Email Address: {sale?.customerEmail || "NA"}</p>
                            </div>

                            <div className="flex items-center justify-between"> 
                                <div>
                            <p className="text-sm">Products</p>
                            <ul className="text-sm text-gray-500">
                                            {sale.products.map((item, index) => (
                                                <li key={index}>- {item.name}= {item.quantity} pieces == (₦{item.amount})</li>
                                ))}
                                    </ul>
                                </div>
                                <div>
                                <h1 className="text-3xl font-bold text-blue-800">₦{sale.totalAmount.toLocaleString()}</h1></div>
                            </div>
                            
                       
                                </div>
                                </Collapse>
                    </div>
                    ))}

                    {sales.length === 0 && <p className="text-sm text-red-600">There was no sales on this day 😪</p>}
                </div>
                
            </div>
        </main>
        
    )
 }