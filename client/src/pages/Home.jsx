import React from 'react'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem.jsx';

export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`)
        const data = await res.json();
        setRentListings(data);
        fetchSelltListings();
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSelltListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sell&limit=4`)
        const data = await res.json();
        setSellListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
  }, [])

  return (
    <div>
      {/* top */}

      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 text-3xl font-bold lg:text-6xl'>Find your next <span className='text-slate-500'>perfect</span>
          <br />place with ease</h1>
        <div className="">
          <h1 className='text-xs sm:text-sm text-gray-400'>
            AK.Estates will help you to find your home fast, easy & comfortable
            <br />We have a wide range of properties for you to choose from
          </h1>
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}

      <div className="max-w-[1100px] mx-auto">
        <Swiper navigation>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide>
                <div
                  style={{
                    background: `url(${listing.imageUrl[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[600px]'
                  key={listing._id}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* listing results for offer, sell & rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {sellListings && sellListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for Sell</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sell'}>Show more places for sell</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {sellListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
