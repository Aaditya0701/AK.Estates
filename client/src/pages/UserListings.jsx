// src/pages/UserListings.js
import { current } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoReturnDownBack } from "react-icons/io5";



const UserListings = () => {
    const { userId } = useParams(); // Extract userId from URL parameters
    const [userListings, setUserListings] = useState([]);
    const [showListingsError, setShowListingsError] = useState(false);
    const { currentUser } = useSelector((state) => state.user);


    useEffect(() => {
        const fetchUserListings = async () => {
            try {
                setShowListingsError(false);
                const res = await fetch(`/api/user/listings/${currentUser._id}`);
                const data = await res.json();
                if (data.success === false) {
                    setShowListingsError(true);
                    return;
                }
                setUserListings(data);
            } catch (error) {
                setShowListingsError(true);
            }
        };

        fetchUserListings();
    }, [userId]);

    const handleDeleteListing = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`,
                {
                    method: 'DELETE',
                },
            )
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <Link to={'/profile'} className='backIconContainer'>
                <div className='backIconStyle'>
                    <p><IoReturnDownBack /></p>
                </div>
            </Link>
            <p className='text-red-700 text-sm'>{showListingsError ? 'Error displaying listings ⚠️' : ''}</p>
            {
                userListings && userListings.length > 0 &&
                <div className='flex flex-col gap-3'>
                    <h1 className='text-center mt-5 text-3xl font-semibold'>Your Listings</h1>
                    {
                        userListings.map((listing) => (
                            <div key={listing._id} className='border rounded-lg p-3 mt-2 flex justify-between items-center gap-3'>
                                <Link to={`/listing/${listing._id}`}>
                                    <img src={listing.imageUrl[0]} alt='listing cover img'
                                        className='h-16 w-16 object-contain'
                                    />
                                </Link>
                                <Link
                                    to={`/listing/${listing._id}`}
                                    className='text-slate-700 font-semibold flex-1 hover:underline truncate'
                                >
                                    <p>
                                        {listing.name}
                                    </p>
                                </Link>
                                <div className='flex flex-col items-center'>
                                    <button onClick={() => handleDeleteListing(listing._id)} className='text-red-700 uppercase'>Delete</button>
                                    <Link to={`/update-listing/${listing._id}`}>
                                        <button className='text-green-700 uppercase'>Edit</button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    );
};

export default UserListings;
