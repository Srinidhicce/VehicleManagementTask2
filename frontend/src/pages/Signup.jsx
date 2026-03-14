import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  });

  const handleChange = (e)=>{
    setForm({...form,[e.target.name]:e.target.value});
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();

    await axios.post("http://localhost:5000/api/auth/signup",form);

    alert("Signup Successful");

    navigate("/");
  };

  return(

    <div>

      <h2>Signup</h2>

      <form onSubmit={handleSubmit}>

        <input name="name" placeholder="Name" onChange={handleChange}/>

        <input name="email" placeholder="Email" onChange={handleChange}/>

        <input type="password" name="password" placeholder="Password" onChange={handleChange}/>

        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange}/>

        <button type="submit">Signup</button>

      </form>

    </div>
  );
}

export default Signup;