import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    }, [listing.userRef])

    const onChange = (e) => {
        setMessage(e.target.value)
    }

    return (
        <>
            {landlord && (
                <div className="">
                    <p>Contact <span className='font-semibold'>{landlord.userName}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                    <div className='flex justify-center mt-6 mb-3 gap-3'>
                        <textarea name="message" id="message" rows='2' value={message} onChange={onChange}
                            className='rounded-lg w-full max-w-[845px] border border-gray-300 p-2'
                            placeholder='Send Message...'
                        ></textarea>
                    </div>
                    <div className='flex justify-center mb-7'>
                        <Link 
                            className='bg-slate-700 text-white p-3 uppercase rounded-lg w-full max-w-[855px] hover:opacity-95 text-center'
                            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                        >
                            Send Message
                        </Link>
                    </div>
                </div>
            )}
        </>
    )
}
