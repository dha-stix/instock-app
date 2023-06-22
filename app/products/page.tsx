"use client"
import SideNav from "../dashboard/SideNav"
import { MdDeleteForever } from "react-icons/md"
import Header from "../dashboard/Header"
import React, { FormEventHandler, useState, useCallback, useEffect } from "react"
import { auth } from '@/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'next/navigation'
import Loading from "../dashboard/Loading"
import { addProduct, deleteProduct, getCategories, getProducts, User, Item } from "@/utils"

interface Product {
    id: string,
    category: string,
    price: number,
    quantity: number,
    name: string
}

export default function Home() { 
    const [user, setUser] = useState<User>()
    const router = useRouter()
    const [categories, setCategories] = useState([])
    const [product, setProduct] = useState<string>("")
    const [price, setPrice] = useState<number>(100)
    const [category, setCategory] = useState<string>("select")
    const [products, setProducts] = useState([])
    
	const isUserLoggedIn = useCallback(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
                setUser({ email: user.email, uid: user.uid });
                getCategories(setCategories)
                getProducts(setProducts)
			} else {
				return router.push("/");
			}
		});
	}, [router]);

	useEffect(() => {
		isUserLoggedIn();
	}, [isUserLoggedIn]);

    if (!user?.email) return <Loading />
    
    const handleSubmit : FormEventHandler<HTMLFormElement> =  (e) => {
        e.preventDefault()
        addProduct(product, price, category)
        setCategory("select")
        setPrice(100)
        setProduct("")

    }
    
    const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
          const value = parseInt(event.target.value, 10);
          setPrice(value);
    };
    
    
    return (
          <main className='flex w-full min-h-[100vh] relative'>
          <SideNav/>
            
            <div className='md:w-[85%] w-full py-4 px-6 min-h-[100vh] bg-[#f4f4f6]'>
               <Header title="Products"/>

                 <section className="w-full mb-10">
                <h3 className="text-lg mb-4">Add Product <span className="text-gray-500 text-sm">(name, price, category)</span></h3>
                    <form className="w-full" onSubmit={handleSubmit}>
                        <div className="flex items-center justify-between space-x-3 mb-4" >
                            <input className="border-b-[1px] px-4 py-2 w-1/3 rounded" type="text" placeholder="Product" name="product" id="product"
                                required value={product}
                                onChange={e => setProduct(e.target.value)}
                            />

                            <input className="border-b-[1px] px-4 py-2 w-1/3 rounded"
                                type="number" placeholder="Price"
                                name="price" id="price" required
                                value={price.toString()}
                                onChange={handlePrice}
                            />

                            <select name="category" className="border-b-[1px] px-4 py-2 w-1/3"
                                value={category}
                                onChange={e => setCategory(e.target.value)}>
                               
                                <option value="select">Select Category</option>
                              {categories?.map((item: Item) =>(
                                <option value={item.name} key={item.id}>{item.name}</option>
                              ))}
                                
                            </select>   
    
                        </div>

                        {category !== "select" ?
                            <button className="py-2 px-4 bg-blue-500 text-white rounded">ADD PRODUCT</button> :
                            <p className="text-red-400 text-sm">You need to pick a category</p>}
                        
                       
                    </form>
                </section>
                
                <div className="w-full">
                    <table className="w-full border-collapse table-auto">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((product: Product) => (
                                <tr key={product.id} className="text-sm text-gray-500">
                                <td>{product.name}</td>
                                <td>{`₦${product.price.toLocaleString()}`}</td>
                                <td>{product.category}</td>
                                    <td>
                                        <MdDeleteForever
                                        className="text-3xl text-red-500 cursor-pointer"
                                        onClick={() => deleteProduct(product.id, product.name)}
                                               
                                    />
                                    </td>

                            </tr>
                            ))}
                          
                            
                            
                        </tbody>
                    </table>
                </div>
            </div>
           
           
            </main>
    )
}