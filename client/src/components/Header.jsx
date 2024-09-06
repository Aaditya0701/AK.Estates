import React from 'react'
import { FaSearch } from "react-icons/fa";
import { RiLoginBoxLine } from "react-icons/ri";
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PiSignOutBold } from "react-icons/pi";
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { IoReturnDownBack } from 'react-icons/io5';


export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleSignout = async (e) => {
        try {
            dispatch(signOutUserStart())
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message))
                return;
            }
            dispatch(signOutUserSuccess(data));
        } catch (error) {
            dispatch(signOutUserFailure(error.message))
        }
    };

    const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';


    return (
        <header className='bg-slate-200 shadow-md headerStyle'>
            <div className='flex justify-between items-center max-w-7xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-3xl flex flex-wrap'>
                        <spam className='text-slate-500'>AK</spam>
                        <spam className='text-slate-700'>Estate</spam>
                    </h1>
                </Link>
                {!isAuthPage && (
                    <form className='bg-slate-100 p-2 rounded-3xl flex items-center'>
                        <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                        <FaSearch className='text-slate-600' />
                    </form>
                )}
                <ul className='flex items-center gap-5'>
                    {location.pathname.includes('/listing') && (
                        <Link to={`/user/listings/${currentUser?._id}`} className='backIconContainer'>
                            <IoReturnDownBack className='backIconStyle' />
                        </Link>
                    )}
                    {location.pathname.includes('/user/listings') && (
                        <Link to={'/profile'} className='backIconContainer'>
                            <IoReturnDownBack className='backIconStyle' />
                        </Link>
                    )}
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
                            <li className='sm:inline text-slate-700 hover:underline'>Signin</li>
                        )
                        }
                    </Link>
                    <Link to=''>
                        {currentUser ? (
                            <li onClick={handleSignout}><PiSignOutBold /></li>
                        ) : (
                            ''
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
