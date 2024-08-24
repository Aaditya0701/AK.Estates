import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    // after AUTHENCATION step in firebase 
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      //pass the required information to database fetched in result
      const res = await fetch ('/api/auth/google',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: result.user.displayName,
              email: result.user.email,
              photo: result.user.photoURL
            }),
        }
      )
      //convert the response in json and save it in data
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      console.log("Couldn't signin with Google", error);
    }
  }

  return (
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95' >Continue With Google</button>
    //adding type=button to ensure that after clicking form will not get submit, as by default type of button is submit
  )
}
