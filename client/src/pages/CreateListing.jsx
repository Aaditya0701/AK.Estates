import React, { useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase.js'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'

export default function CreateListing() {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrl: [],
        name: "",
        description: "",
        address: "",
        regularPrice: '',
        discountPrice: 0,
        bathroomCount: 1,
        bedroomCount: 1,
        furnished: false,
        semiFurnished: false,
        parking: false,
        type: 'sell',
        offer: false,
    });
    console.log(formData);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    // upload and store images in firebase functionality
    const handleImageUpload = (e) => {
        if (files.length > 0 && files.length + formData.imageUrl.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promise = [];

            for (let i = 0; i < files.length; i++) {
                promise.push(storeImage(files[i]));
            }
            Promise.all(promise).then((urls) => {
                setFormData({
                    ...formData,
                    imageUrl: formData.imageUrl.concat(urls),
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError('Image uploading failed (2mb max per image)');
                setUploading(false)
            })
        } else {
            setImageUploadError('Min. 1 and Max. 6 Images can upload.')
            setUploading(false)
        }
    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        })
    }

    // delete image functionality
    const handleDeleteImage = (index) => {
        setFormData({
            ...formData,
            imageUrl: formData.imageUrl.filter((_, i) => i !== index),
        });
    };

    /* const handleChange = (e) => {
        if (e.target.id === 'sell' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'semiFurnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    }; */
    const handleChange = (e) => {
        const { id, checked } = e.target;

        if (id === 'furnished') {
            setFormData((prevState) => ({
                ...prevState,
                furnished: checked,
                semiFurnished: checked ? false : prevState.semiFurnished, // Uncheck semiFurnished if furnished is checked
            }));
        } else if (id === 'semiFurnished') {
            setFormData((prevState) => ({
                ...prevState,
                semiFurnished: checked,
                furnished: checked ? false : prevState.furnished, // Uncheck furnished if semiFurnished is checked
            }));
        } else if (id === 'sell' || id === 'rent') {
            setFormData((prevState) => ({
                ...prevState,
                type: id,
            }));
        } else if (id === 'parking' || id === 'offer') {
            setFormData((prevState) => ({
                ...prevState,
                [id]: checked,
            }));
        } else if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData((prevState) => ({
                ...prevState,
                [id]: e.target.value,
            }));
        }
    };


    //submit the data to database
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrl.length < 1) return setError('Must upload atleast one image.')
            if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be less than actual price')
            setLoading(true)
            setError(false)

            const res = await fetch('/api/listing/create',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(
                        {
                            ...formData,
                            userRef: currentUser._id,
                        }
                    ),
                }
            );
            const data = await res.json()
            setLoading(false)
            if (data.success === false) {
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
        }
        catch (error) {
            setError(error.message)
            setLoading(false);
        }
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-5'>
                Create Listing
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type="text"
                        placeholder='Name'
                        id='name'
                        className='border p-3 rounded-lg'
                        maxLength='62'
                        minLength='4'
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        type="textarea"
                        placeholder='Description'
                        id='description'
                        className='border p-3 rounded-lg'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    <input
                        type="text"
                        placeholder='Address'
                        id='address'
                        className='border p-3 rounded-lg'
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />
                    {/* checkbox div start */}
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-3'>
                            <div className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    id="sell"
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={formData.type === 'sell'}
                                />
                                <span>Sell</span>
                            </div>
                            <div className='flex gap-2'>
                                <input
                                    type="checkbox"
                                    id="rent"
                                    className='w-5'
                                    onChange={handleChange}
                                    checked={formData.type === 'rent'}
                                />
                                <span>Rent</span>
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="parking" className='w-5'
                                    onChange={handleChange} value={formData.parking}
                                />
                                <span>Parking</span>
                            </div>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="furnished" className='w-5'
                                    onChange={handleChange} checked={formData.furnished}
                                />
                                <span>Furnished</span>
                            </div>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="semiFurnished" className='w-5'
                                    onChange={handleChange} checked={formData.semiFurnished}
                                />
                                <span>Semi-Furnished</span>
                            </div>
                            <div className='flex gap-2'>
                                <input type="checkbox" id="offer" className='w-5'
                                    onChange={handleChange} value={formData.offer}
                                />
                                <span>Offer</span>
                            </div>
                        </div>
                    </div>  {/* checkbox div end */}
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedroomCount' min='1' max='10' required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange} value={formData.bedroomCount}
                            />
                            <p>Bedroom</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathroomCount' min='1' max='10' required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange} value={formData.bathroomCount}
                            />
                            <p>Bathroom</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' min='1' max='100000000' required
                                className='p-2 border border-gray-300 rounded-lg'
                                onChange={handleChange} value={formData.regularPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular Price</p>
                                {formData.type === 'rent' && (
                                    <span className='text-xs'>(₹ / Month)</span>
                                )}
                            </div>
                        </div>
                        {formData.offer &&
                            (
                                <div className='flex items-center gap-2'>
                                    <input type="number" id='discountPrice' min='0' max='100000000' required
                                        className='p-2 border border-gray-300 rounded-lg'
                                        onChange={handleChange} value={formData.discountPrice}
                                    />
                                    <div className='flex flex-col items-center'>
                                        <p>Discount Price</p>
                                        {formData.type === 'rent' && (
                                            <span className='text-xs'>(₹ / Month)</span>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>  {/* end of 1st flex-1 div */}
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>Images:
                        <span className='font-normal text-gray-700 ml-2'>The first image will be cover image (max. 6 images can upload)</span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className='p-3 border border-gray-300 rounded-lg w-full'
                            type="file"
                            id='image'
                            accept='image/*'
                            multiple
                        />
                        <button
                            type='button'
                            disabled={uploading}
                            onClick={handleImageUpload}
                            className='p-3 border border-green-700 rounded-lg text-green-700 uppercase hover:shadow-lg disabled:opacity-80'
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    {/* {
                        formData.imageURL.length > 0 && formData.imageURL.map((url) => (
                            <div className='flex justify-between p-3 border items-center'>
                                <img src={url} alt="Property Images" className='w-30 h-20 object-contain rounded-lg' />
                                <button className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                            </div>
                        ))
                    } */}
                    {
                        formData.imageUrl.length > 0 && (
                            <div className="overflow-y-auto max-h-72">
                                {formData.imageUrl.map((url, index) => (
                                    <div key={index} className="flex justify-between p-3 border items-center mb-2">
                                        <img src={url} alt="Property Images" className="w-30 h-20 object-contain rounded-lg" />
                                        <button
                                            className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                                            type='button'
                                            onClick={() => handleDeleteImage(index)}
                                        >Delete</button>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    <button
                        disabled={loading || uploading}
                        className='p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80 mt-1'
                    >
                        {loading ? 'Creating...' : 'Create Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div> {/* end of 2nd flex-1 div */}
            </form>
        </main>
    )
}
