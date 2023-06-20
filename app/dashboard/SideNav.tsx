import Link from "next/link";
import { RiDashboardFill } from "react-icons/ri"
import { BsFillBarChartFill, BsPersonFillLock } from "react-icons/bs"
import { MdShoppingCart, MdCategory } from "react-icons/md"
import { LogOut } from "@/utils";
import { useRouter } from "next/navigation";

export default function SideNav() { 
     const router = useRouter()
    return (
         <div className='w-[15%] md:block hidden'>
            <nav className='w-[15%] fixed flex flex-col left-0 h-[100vh] bg-[#160F3F] p-4 space-y-8'>
                <Link href="/" className='hover:text-white mt-4 mb-8 font-bold text-xl text-gray-300'>InStock</Link>
                <div className="w-full flex items-center">
                      <RiDashboardFill className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/dashboard" className="text-[#9AA8BD] hover:text-white">Dashboard</Link>
                </div>
               
                <div className="w-full flex items-center">
                      <BsFillBarChartFill className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/sales" className="text-[#9AA8BD] hover:text-white">Sales</Link>
                </div>
                
                  <div className="w-full flex items-center">
                      <MdShoppingCart className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/products" className="text-[#9AA8BD] hover:text-white">Products</Link>
                </div>

                 <div className="w-full flex items-center">
                      <MdCategory className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/categories" className="text-[#9AA8BD] hover:text-white">Categories</Link>
                </div>

                  <div className="w-full flex items-center">
                      <BsPersonFillLock className="text-[#9AA8BD] hover:text-white mr-2"/>
                     <Link href="/" className="text-[#9AA8BD] hover:text-white" onClick={() => LogOut(router)}>Log out</Link>
                </div>
                
            </nav>
            </div>
    )
}