import React from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <img
          className='rounded-full h-28 w-28 object-cover cursor-pointer self-center mt-2'
          src={currentUser.avatar}
          alt="Profile Image"
        />
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='userName'
        />  
        <input
          type='text'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
        />  
        <input
          type='text'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Updte</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-600 cursor-pointer'>Delete Account</span>
        <span className='text-red-600 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
