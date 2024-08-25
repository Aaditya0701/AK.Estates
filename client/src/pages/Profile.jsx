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
  //console.log(formData);

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
        />
        <input
          type='text'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
        />
        <input
          type='text'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
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
