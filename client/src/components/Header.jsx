import React from 'react'
import { FaSearch } from "react-icons/fa";
import { RiLoginBoxLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const { currentUser } = useSelector(state => state.user)
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-7xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-3xl flex flex-wrap'>
                        <spam className='text-slate-500'>AK</spam>
                        <spam className='text-slate-700'>Estate</spam>
                    </h1>
                </Link>
                <form className='bg-slate-100 p-2 rounded-3xl flex items-center'>
                    <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <FaSearch className='text-slate-600' />
                </form>
                <ul className='flex items-center gap-5'>
                    <Link to='/'>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='hidden sm:inline text-slate-700 hover:underline'>About Us</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img
                                className='rounded-full h-7 w-7 object-cover'
                                src={currentUser.avatar}
                                alt="Profile"
                            />
                        ) : (
                            <li className='hidden sm:inline text-slate-700 hover:underline'>Signin</li>
                        )
                        }
                    </Link>
                    {/* <Link to='/signin'>
                        <li className='sm:flex text-slate-700 hover:bg-slate-300 p-2'><RiLoginBoxLine /></li>
                    </Link> */}
                </ul>
            </div>
        </header>
    )
}
