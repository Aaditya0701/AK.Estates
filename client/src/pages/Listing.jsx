import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoReturnDownBack } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'


export default function Listing() {

    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    SwiperCore.use([Navigation]);

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
            <Link to={`/user/listings/${currentUser._id}`} className='backIconContainer'>
                <div className='backIconStyle'>
                    <p><IoReturnDownBack /></p>
                </div>
            </Link>
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
                <div>
                    <Swiper navigation>
                        {listing.imageUrl.map((url) => (
                            <SwiperSlide key={url}>
                                <img
                                    src={url}
                                    alt={`Listing image ${url + 1}`}
                                    className="h-[500px] w-[1000px] object-cover p-1 ml-60"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            }
        </main>
    )
}