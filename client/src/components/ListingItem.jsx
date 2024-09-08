import { Link } from "react-router-dom"
import { MdLocationOn } from 'react-icons/md'
import { FaBed, FaBath } from 'react-icons/fa'

export default function ListingItem({ listing }) {
    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow 
            overflow-hidden rounded-lg w-full sm:w-[350px]"
        >
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrl[0]} alt="listing cover"
                    className="h-[320px] sm:h-[220px] w-[520] sm:w-[420px] object-cover
                    hover:scale-105 transition-scale duration-300"
                />
                <div className="p-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        {listing.offer &&
                            <img src="./special-offer.jpeg" alt="" className="h-9" />
                        }
                        <p className="truncate text-lg font-semibold text-slate-700">
                            {listing.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                        <p className="truncate text-sm text-gray-600">{listing.address}</p>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2"
                    >
                        {listing.description}
                    </p>
                    <div className=" flex flex-row items-center mt-2 gap-2 text-slate-500 font-semibold">

                        {
                            listing.offer ? (
                                <div className="">
                                    <p className=''>
                                        Offer Price: ₹ {(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')}
                                        <span className="text-gray-500 text-xs ml-1 line-through">{listing.regularPrice}</span>
                                    </p>
                                </div>

                            ) : (
                                <p className=''>
                                    Final Price: ₹ {listing.regularPrice.toLocaleString('en-US')}
                                </p>
                            )
                        }
                        {listing.type === 'rent' && '/month'}
                    </div>
                    <div className="text-slate-700 flex gap-4">
                        <div className="font-bold text-xs flex items-center gap-1">
                            <FaBed />
                            {listing.bedroomCount > 1 ? `${listing.bedroomCount} beds` : `${listing.bedroomCount} bed`}
                        </div>
                        <div className="font-bold text-xs flex items-center gap-1">
                            <FaBath />
                            {listing.bathroomCount > 1 ? `${listing.bathroomCount} baths` : `${listing.bedroomCount} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
