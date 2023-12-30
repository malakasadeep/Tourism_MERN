import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import Swal from 'sweetalert2'
import bgimage from '../assets/img/bg/20852675_6345959.jpg'


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Swal.fire("Please enter a valid email address", "", "error");
      return;
    }

    if (formData.password.length <= 6 ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "password must at least have 8 charaters",
      });
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password Not Matched!",
      });
      return;
    }

    try {
      
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${data.message}`,
        });
        return;
      }

      setLoading(false);
      setError(null);
      Swal.fire({
        title: "Succedd!",
        text: "Your profile created!",
        icon: "success"
      });
      
      navigation('/sign-in');

    } catch (error) {

      setLoading(false);
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.message}`,
      });

    }
  };

  return (

    <div style={{ height: '100vh',  backgroundSize: "cover",backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
      <br/><br/><br/><br/><br/>
    <div className='p-3 max-w-lg mx-auto  bg-white/10 z-10 backdrop-filter backdrop-blur-lg shadow-lg rounded-2xl'>

      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <select id='usertype' className='border p-3 rounded-lg' onChange={handleChange} required>
          <option selected hidden disabled>Select user type</option>
          <option value="Tourist">Tourist</option>
          <option value="Seller">Seller</option>
        </select> 
        <input type='text' placeholder='Username' id='username' className='border p-3 rounded-lg' onChange={handleChange} required/> 
        <input type='text' placeholder='Email' id='email' className='border p-3 rounded-lg' onChange={handleChange} required/> 
        <input type='password' placeholder='Password' id='password' className='border p-3 rounded-lg' onChange={handleChange} required/> 
        <input type='password' placeholder='Re-type Password' id='repeatPassword' className='border p-3 rounded-lg' onChange={handleChange} /> 
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'sign up'}</button>
        <OAuth/>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
    </div>
  );
}
