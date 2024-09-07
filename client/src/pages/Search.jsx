import React from 'react'

export default function Search() {
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2">
                        <lable className='whitespace-nowrap font-semibold'>
                            Search Term :
                        </lable>
                        <input type="text" name="search" placeholder="Search..."
                            className='border rounded-lg p-3 w-full'
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <lable className='font-semibold'>Type :</lable>
                        <div className="flex gap-2">
                            <input type="checkbox" id='all' className='w-5' />
                            <span>Rent & Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='sell' className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <lable className='font-semibold'>Amenities :</lable>
                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='semiFurnished' className='w-5' />
                            <span>Semi-Furnished</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <lable className='font-semibold'>Sort :</lable>
                        <select id="sort_order" className='border rounded-lg p-2'>
                            <option>Price high to low</option>
                            <option>Price low to high</option>
                            <option>Latest</option>
                            <option>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className="text-3xl font-semibold border-b p-3 text-slate-700 mt-4">
                <h1>Listing Results:</h1>
            </div>
        </div>
    )
}
