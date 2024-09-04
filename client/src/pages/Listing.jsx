import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoReturnDownBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkedAlt, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.


export default function Listing() {

    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    SwiperCore.use([Navigation]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                setError(false);

                const res = await fetch(`/api/listing/get/${params.listingId}`);

                if (!res.ok) {
                    // If response status is not ok (e.g., 404, 500), throw an error
                    throw new Error('Failed to fetch the listing');
                }

                const data = await res.json();

                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }

                setListing(data);
                setLoading(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId]); //this is dependency add for the loader to load only when there is new id
    return (
        <main>
            {
                loading &&
                <div className="loader">
                    <div class="lds-grid">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            }
            {
                error &&
                <p className='text-red-700 text-center my-7 text-2xl'>
                    Something went wrong.
                </p>
            }
            {listing && !loading && !error &&
                <div className="max-w-screen-lg mx-auto">
                    <Swiper navigation>
                        {listing.imageUrl.map((url, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={url}
                                    alt={`Listing image ${index + 1}`}
                                    className="w-full h-auto max-h-[550px] object-cover p-1"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='fixed top-[15%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[1%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-4 gap-3'>
                        <p className='flex flex-col sm:flex-row text-2xl font-semibold gap-2'>
                            {listing.name} - ₹{' '}
                            {listing.regularPrice.toLocaleString('en-US')}
                            <p className='underline'>
                                {listing.offer ? ' (Limited Period Offer)' : ''}
                            </p>
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center mt-4 gap-2 text-slate-600  text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sell'}
                            </p>
                            {
                                listing.offer ? (
                                    <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                        Final Price: ${+listing.regularPrice - +listing.discountPrice}
                                    </p>
                                ) : (
                                    <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                        Final Price: ${+listing.regularPrice}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                    <p className='text-slate-800 descStyle'>
                        <span className='font-semibold text-black'>
                            Description - {' '}
                        </span>
                        {listing.description}
                    </p>
                    <ul className='p-3 flex flex-wrap gap-4 text-green-900 font-semibold text-sm'>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaBed className='text-lg' />
                            {
                                listing.bathroomCount > 1 ? `${listing.bedroomCount} Bedrooms`
                                    : `${listing.bedroomCount} Bedroom`
                            }
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaBath className='text-lg' />
                            {
                                listing.bathroomCount > 1 ? `${listing.bathroomCount} Bedrooms`
                                    : `${listing.bathroomCount} Bedroom`
                            }
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaParking className='text-lg' />
                            {
                                listing.parking ? 'Parking' : 'No Parking'
                            }
                        </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'>
                            <FaChair className='text-lg' />
                            {
                                listing.furnished ? 'Furnished' : listing.semiFurnished ? 'Semi-Furnished' : 'Not Furnished'
                            }
                        </li>
                    </ul>
                </div>
            }
        </main>
    )
}