import React from 'react'

export default function CreateListing() {
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-5'>
                Create Listing
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' id='name' className='border p-3 rounded-lg' maxLength='62' minLength='10' required />
                    <textarea type="text" placeholder='Description' id='description' className='border p-3 rounded-lg' required />
                    <input type="text" placeholder='Address' id='address' className='border p-3 rounded-lg' required />
                    {/* checkbox div start */}
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-3'>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="sell" className='w-5' />
                                <span>Sell</span>
                            </div>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="rent" className='w-5' />
                                <span>Rent</span>
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="parking" className='w-5' />
                                <span>Parking</span>
                            </div>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="furnished" className='w-5' />
                                <span>Furnished</span>
                            </div>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="Offer" className='w-5' />
                                <span>Offer</span>
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="Offer" className='w-5' />
                                <span>Offer</span>
                            </div>
                        </div>
                    </div>  {/* checkbox div end */}
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedroom' min='1' max='10' required
                                className='p-3 border border-gray-300 rounded-lg' defaultValue={'1'} />
                            <p>Bedroom</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathroom' min='1' max='10' required
                                className='p-3 border border-gray-300 rounded-lg' defaultValue={'1'} />
                            <p>Bathroom</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' min='1' max='10' required
                                className='p-3 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                <span className='text-xs'>(₹ / Month)</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' min='1' max='10' required
                                className='p-3 border border-gray-300 rounded-lg' />
                            <div className='flex flex-col items-center'>
                                <p>Discount Price</p>
                                <span className='text-xs'>(₹ / Month)</span>
                            </div>
                        </div>
                    </div>
                </div>  {/* end of 1st flex-1 div */}
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-700 ml-2'>The first image will be cover image (max. 6 images can upload)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                            className='p-3 border border-gray-300 rounded-lg w-full'
                            type="file"
                            id='image'
                            accept='image/*'
                            multiple
                        />
                        <button
                            className='p-3 border border-green-700 rounded-lg text-green-700 uppercase hover:shadow-lg disabled:opacity-80'
                        >Upload</button>
                    </div>
                    <button className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                </div> {/* end of 2nd flex-1 div */}
            </form>
        </main>
    )
}
