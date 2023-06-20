import { ImExit } from "react-icons/im"
import { LogOut } from "@/utils"
import { useRouter } from "next/navigation"
import { HiMenuAlt2 } from "react-icons/hi"
import { useState } from "react"
import MobileNav from "./MobileNav"

interface Props {
    title: string
}

export default function Header({ title }: Props) {
    const router = useRouter()
    const [showModal, setShowModal] = useState(false)
    return (
     <header className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>{title}</h2>
                    <div className='flex items-center space-x-6'>
                <p className='text-[#9AA8BD] md:block hidden'>Welcome Admin</p>
                <ImExit className='text-2xl text-[#D64979] md:block hidden  cursor-pointer' onClick={() => LogOut(router)} />
                <div className="bg-white p-2 cursor-pointer md:hidden block rounded" onClick={()=> setShowModal(true)}>
                    <HiMenuAlt2 className='text-3xl text-[#D64979]'/>
                </div>   
            </div>
            {showModal && (
                <div>
                    <MobileNav setShowModal={setShowModal} />
                </div>
                    )}
        </header>

    )
}