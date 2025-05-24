import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Superlogin = () => {

  const Navigate =useNavigate();
  const [username,setUsername] = useState();
  const [password,setPassword] = useState();
  const [loading,setloading] = useState(false);

  const handlerSubmit = (e) => {
     e.preventDefault();
    setloading(true);
 
    if(username === 'rutik'){
      if(password === '1234'){
        setTimeout(() => {
            toast.success('Successfully toasted!')
             Navigate("/management")
              setloading(false)
        }, 2000);
       
      }
      else{
        toast.error("Incorrect Password")
      }
    }
    else{
      toast.error("Incorrect Username")
    }
  }

  return (
    <div className="bg-white">
      
      <div className="flex h-screen flex-col items-center justify-center font-mono">
      <div><Toaster/></div>
        <div className="max-h-auto mx-auto max-w-xl">
          <form className="w-full">
            <div className="mb-10 space-y-3 border-2 border-gray-200 p-8 shadow-md rounded-lg ">
            {loading ? ( <span className='loading loading-infinity loading-xl'></span>) : "Superadmin login"}
           
              <div className="space-y-1 mt-8">
                <div className="flex flex-col space-y-2 mb-4">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 align-start text-left">
                    Username
                  </label>
                  <input
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    placeholder="username"
                    onChange={(e)=>setUsername(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-left">
                    Password
                  </label>
                  <input
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    placeholder="password"
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="ring-offset-background focus-visible:ring-ring flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                type="submit" onClick={handlerSubmit}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Superlogin;
