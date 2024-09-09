import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {

    const defaultSidebarData = {
        searchTerm: '',
        type: 'all',
        offer: false,
        parking: false,
        furnished: false,
        semiFurnished: false,
        sort: 'created_at',
        order: 'desc',
    };

    const [sidebarData, setSidebarData] = useState(defaultSidebarData);
    console.log(sidebarData);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const offerFromUrl = urlParams.get('offer');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const semiFurnishedFromUrl = urlParams.get('semiFurnished');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (
            searchTermFromUrl ||
            typeFromUrl ||
            offerFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            semiFurnishedFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                offer: offerFromUrl === 'true' ? true : false,
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                semiFurnished: semiFurnishedFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false)
            const searchQuery = urlParams.toString();
            const res = await fetch(`api/listing/get?${searchQuery}`)
            const data = await res.json()
            if (data.length > 5) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data)
            setLoading(false);
        }
        fetchListings();

    }, [location.search])

    const handleChange = (e) => {
        if (e.target.id === 'all') {
            // If 'all' is selected, reset other filters to their default state
            setSidebarData({
                ...sidebarData,
                type: e.target.id,
                offer: false,
                parking: false,
                furnished: false,
                semiFurnished: false
            });
        } else if (e.target.id === 'sell' || e.target.id === 'rent') {
            setSidebarData({
                ...sidebarData,
                type: e.target.id,
            });
        }

        if (e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value,
            });
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'semiFurnished' || e.target.id === 'offer') {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.checked ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const [sort, order] = e.target.value.split('_');
            setSidebarData({
                ...sidebarData,
                sort: sort || 'created_at',
                order: order || 'desc',
            });
        }
    };

    /* const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'sell' || e.target.id === 'rent') {
            setSidebarData({
                ...sidebarData,
                type: e.target.id,
            })
        }
        if (e.target.id === 'searchTerm') {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'semiFurnished' || e.target.id === 'offer') {
            setSidebarData({
                ...sidebarData,
                [e.target.id]:
                    e.target.checked || e.target.checked === 'true' ? true : false
            })

        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({
                ...sidebarData,
                sort,
                order
            })
        }
    } */

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('semiFurnished', sidebarData.semiFurnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);

        const searchQuery = urlParams.toString();

        navigate(`/search?${searchQuery}`);


    }

    const handleClearAll = () => {
        setSidebarData(defaultSidebarData);  // Reset sidebar data to default values
        navigate('/search');  // Clear the URL search parameters
    };

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings
        const UrlParams = new URLSearchParams(location.search);
        UrlParams.set('startIndex', startIndex);
        const searchQuery = UrlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`)
        const data = await res.json();
        if (data.length < 6) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen w-auto md:w-72">
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2">
                        <lable className='whitespace-nowrap font-semibold'>
                            Search Term :
                        </lable>
                        <input type="text" name="search" placeholder="Search..."
                            className='border rounded-lg p-3 w-full'
                            id='searchTerm'
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <lable className='font-semibold'>Type :</lable>
                        <div className="flex gap-2">
                            <input type="checkbox" id='all' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.type === 'all'}
                            />
                            <span>Rent & Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='sell' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.type === 'sell'}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='rent' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.type === 'rent'}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='offer' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <lable className='font-semibold'>Amenities :</lable>
                        <div className="flex gap-2">
                            <input type="checkbox" id='parking' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.parking}
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='furnished' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id='semiFurnished' className='w-5'
                                onChange={handleChange}
                                checked={sidebarData.semiFurnished}
                            />
                            <span>Semi-Furnished</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <lable className='font-semibold'>Sort :</lable>
                        <select
                            onChange={handleChange}
                            defaultValue={'created_at_desc'}
                            id="sort_order"
                            className='border rounded-lg p-2'
                        >
                            <option value='regularPrice_desc'>Price high to low</option>
                            <option value='regularPrice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 rounded-lg p-3 text-white uppercase hover:opacity-95'>Search</button>
                    <div className="">
                        <lable onClick={handleClearAll} className='font-semibold hover:underline cursor-pointer'>Clear All</lable>
                    </div>
                </form>
            </div>
            <div className="flex-1">
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-4'>Listing Results:</h1>
                <div className="p-7 flex flex-wrap gap-4">
                    {!loading && listings.length === 0 && (
                        <p className='text-xl text-slate-700'>No Listing Found !</p>
                    )}

                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )}

                    {!loading && listings && listings.map((listing) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))}

                </div>
                <div className="items-center w-full text-center">
                    {showMore && (
                        <button
                            onClick={onShowMoreClick}
                            className='text-green-700 hover:underline p-6'
                        >
                            Show More...
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
