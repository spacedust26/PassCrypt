import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setPasswordArray(passwords)
    }


    useEffect(() => {
        getPasswords()
    }, [])


    const copyText = (text) => {
        toast('Copied to clipboard!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("icons/eye-close.png")) {
            ref.current.src = "icons/eye.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eye-close.png"
        }

    }

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {

            // If any such id exists in the db, delete it 
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

            setPasswordArray([...passwordArray, { ...form, id: uuidv4() }])
            await fetch("http://localhost:3000/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })

            // Otherwise clear the form and show toast
            setform({ site: "", username: "", password: "" })
            toast('Password saved!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            toast('Error: Password not saved!');
        }

    }

    const deletePassword = async (id) => {
        console.log("Deleting password with id ", id)
        let c = confirm("Do you really want to delete this password?")
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id))
            
            await fetch("http://localhost:3000/", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })

            toast('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true, 
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

    }

    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

  return (
    <>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
      <ToastContainer />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="p-3 md:mycontainer text-white md:min-h-[82.75vh]">
        <h1 className='text-4xl text font-bold text-center'>
          <span className='text-purple-300'>P</span>
          <span>ass</span>
          <span className='text-purple-300'>C</span>
          <span>rypt</span>
        </h1>
        <p className='text-purple-300 text-lg text-center'>Your own Password Manager</p>

        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input value={form.site} onChange={handleChange} className='rounded-full border border-purple-300 w-full p-4 py-1' type="text" name="site" id="site" placeholder='Enter website URL' ></input>

          <div className="flex w-full justify-between gap-8 md:flex-row flex-col">
            <input value={form.username} onChange={handleChange} className='rounded-full border border-purple-300 w-full p-4 py-1' type="text" placeholder='Enter Username' name='username' id='username'></input>
            <div className="relative">
              <input ref={passwordRef} value={form.password} onChange={handleChange} className='rounded-full border border-purple-300 w-full p-4 py-1' type="password" placeholder='Enter Password' name='password' id='password'></input>
              <span className='absolute right-[6px] top-[5px] cursor-pointer' onClick={showPassword}>
                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
              </span>
            </div>
          </div>

          <button onClick={savePassword} className='flex justify-center items-center text-white bg-[#86469C] hover:bg-purple-500 rounded-full px-4 py-2 w-fit gap-2 border border-purple-300'> <lord-icon
            src="https://cdn.lordicon.com/jgnvfzqg.json" trigger="hover" colors="primary:#ffffff">
          </lord-icon>Save Password</button>
        </div>


        <div className="passwords">
          <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
          {passwordArray.length === 0 && <div>No passwords to show</div>}
          {passwordArray.length !== 0 &&
            <table className="table-auto w-full rounded-md overflow-hidden mb-10">
              <thead className='bg-purple-900 text-white'>
                <tr>
                  <th className='py-2'>Site</th>
                  <th className='py-2'>Username</th>
                  <th className='py-2'>Password</th>
                  <th className='py-2'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-purple-700'>
                {passwordArray.map((item, index) => {
                  return <tr key={index}>

                    <td className='text-center border border-white'>
                      <div className="flex items-center justify-center">
                        <span><a href={item.site} target='_blank'>{item.site}</a></span>
                        <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.site) }}>
                          <lord-icon
                            src="https://cdn.lordicon.com/lyrrgrsl.json"
                            trigger="hover" colors="primary:#ffffff"
                            style={{ "width": "20px", "height": "20px", "paddingTop": "4px", "paddingeft": "3px" }}>
                          </lord-icon>
                        </div>
                      </div>
                    </td>

                    <td className='text-center border border-white'>
                      <div className="flex items-center justify-center">
                        <span>{item.username}</span>
                        <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.username) }}>
                          <lord-icon
                            src="https://cdn.lordicon.com/lyrrgrsl.json"
                            trigger="hover" colors="primary:#ffffff"
                            style={{ "width": "20px", "height": "20px", "paddingTop": "4px", "paddingeft": "3px" }}>
                          </lord-icon>
                        </div>
                      </div>
                    </td>

                    <td className='text-center border border-white'>
                      <div className="flex items-center justify-center">
                        <span>{"*".repeat(item.password.length)}</span>
                        <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.password) }}>
                          <lord-icon
                            src="https://cdn.lordicon.com/lyrrgrsl.json"
                            trigger="hover" colors="primary:#ffffff"
                            style={{ "width": "20px", "height": "20px", "paddingTop": "4px", "paddingeft": "3px" }}>
                          </lord-icon>
                        </div>
                      </div>
                    </td>

                    <td className='text-center border border-white'>
                      <div className="flex items-center justify-center">
                        <span className='cursor-pointer mx-1'><img src="icons/pencil.png" width={15} className='hover:scale-125' onClick={() => { editPassword(item.id) }} /></span>

                        <span className='cursor-pointer mx-1'><lord-icon
                          src="https://cdn.lordicon.com/skkahier.json"
                          trigger="hover" colors="primary:#ffffff" style={{ "width": "20px", "height": "20px" }} onClick={() => { deletePassword(item.id) }}>
                        </lord-icon></span>
                      </div>
                    </td>

                  </tr>
                })}


              </tbody>
            </table>}
        </div>
      </div>
    </>
  )
}

export default Manager
