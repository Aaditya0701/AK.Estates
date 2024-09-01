import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RiImageEditLine } from "react-icons/ri";
import { useRef, useEffect } from 'react';
import { app } from '../firebase.js';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserFailure, signOutUserSuccess } from '../redux/user/userSlice.js';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [imgLoading, setImgLoading] = useState(0);
  const [imgUploadError, setimgUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    // Reset the error and loading state
    setimgUploadError(false);
    setImgLoading(0);

    // Check if file size is greater than 2 MB
    const MAX_FILE_SIZE_MB = 2;
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setimgUploadError(true); // Set error if file is too large
      return; // Exit early to prevent uploading
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload Progress: ${Math.round(progress)}%`); // Debugging line
        setImgLoading(Math.round(progress)); // Update progress
      },
      (error) => {
        setimgUploadError(true); // Set error in case of failure
      },
      // If the file is uploaded successfully, get the download URL
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          setImgLoading(100); // Set loading to 100% after successful upload
        });
      }
    );
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); // avoids loading of complete page
    try {
      dispatch(updateUserStart());

      // Check if the username or email is already taken
      const uniqueCheckRes = await fetch(`/api/user/check-unique`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          userId: currentUser._id,
        }),
      });

      const uniqueCheckData = await uniqueCheckRes.json();

      if (!uniqueCheckData.isUnique) {
        setUpdateSuccess(false);
        dispatch(updateUserFailure('Username or Email already taken'));
        return;
      }

      // Proceed with updating the user if the fields are unique
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setUpdateSuccess(false);
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      setUpdateSuccess(false);
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async (e) => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  };

  /* const handleShowListings = async () => {
    try {
      setShowListingsError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true)
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true)
    }
  } */
  const handleShowListings = () => {
    navigate(`/user/listings/${currentUser._id}`);
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-2'>
        Profile
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <img
          className='rounded-full h-28 w-28 object-cover cursor-default self-center mt-2'
          src={formData.avatar || currentUser.avatar}
          alt="Profile Image"
        />
        <input
          onChange={(e) => setFile(e.target.files[0])}
          className='hidden'
          type="file"
          ref={fileRef}
          accept='image/*'
        />
        <p onClick={() => fileRef.current.click()} className='self-center cursor-pointer editImg'>
          <RiImageEditLine />
        </p>
        <p className='text-sm self-center mt-2'>
          {
            imgUploadError ? (
              <span className='text-red-700'>
                Error while uploading Image (Image must be less than 2 Mb)
              </span>
            ) : imgLoading > 0 && imgLoading < 100 ? (
              <span className='text-slate-700'>
                {`Uploading ${imgLoading}%`}
              </span>
            ) : imgLoading === 100 ? (
              <span className='text-green-700'>
                Image Uploaded Successfully!
              </span>
            ) : (
              ''
            )
          }
        </p>

        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='userName'
          defaultValue={currentUser.userName}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
        <Link
          to={'/create-listing'}
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-600 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='text-red-600 cursor-pointer'>Sign Out</span>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully !' : ""}
      </p>
      <button
        className='text-green-700 w-full'
        onClick={handleShowListings}
      >
        Show Listings
      </button>
      <p className='text-red-700 text-sm'>{showListingsError ? 'Error displaying listings ⚠️' : ''}</p>
      {/* {
        userListings && userListings.length > 0 &&
        <div className=''>
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
                  <button className='text-red-700 uppercase'>Delete</button>
                  <button className='text-green-700 uppercase'>Edit</button>
                </div>
              </div>
            ))
          }
        </div>
      } */}
    </div>
  );
}

/* 
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RiImageEditLine } from "react-icons/ri";
//to refer the input file tag to editImg icon
import { useRef, useEffect } from 'react';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';


export default function Profile() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  //console.log(file);
  const [imgLoading, setImgLoading] = useState(0);
  //console.log(imgLoading);
  const [imgUploadError, setimgUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImgLoading(Math.round(progress));
      },
      (error) => {
        setimgUploadError(true);
      },
      //if file uploaded seccessfully get the download URL 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          })
      },
    );
  }

  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]:e.target.value})
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-5'>
        <img
          className='rounded-full h-28 w-28 object-cover cursor-default self-center mt-2'
          src={formData.avatar  || currentUser.avatar}
          alt="Profile Image"
        />
        <input
          onChange={(e) => setFile(e.target.files[0])}
          className='hidden'
          type="file"
          ref={fileRef}
          accept='image/*'
        />
        <p onClick={() => fileRef.current.click()} className='self-center cursor-pointer editImg'>
          <RiImageEditLine />
        </p>
        <p className='text-sm self-center'>
          {
            imgUploadError ? (
              <span className='text-red-700'>
                Error while uploading Image (Image must be less than 2 Mb)
              </span> 
            ) : imgLoading > 0 && imgLoading < 100 ? (
              <span className='text-slate-700'>
                {`Uploading ${imgLoading}%`}
              </span>
            ) : imgLoading === 100 ? (
              <span className='text-green-700'>
                Image Uploaded Successfully !
              </span>
            ) : (
              ''
            )
          }
        </p>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='userName'
          defaultValue={currentUser.userName}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type='text'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Updte</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-600 cursor-pointer'>Delete Account</span>
        <span className='text-red-600 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
 */