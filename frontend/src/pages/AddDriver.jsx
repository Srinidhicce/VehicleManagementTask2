import { useState } from "react";
import axios from "axios";

function AddDriver(){

  const [driverId,setDriverId] = useState("");
  const [driverName,setDriverName] = useState("");
  const [phoneNumber,setPhoneNumber] = useState("");
  const [photo,setPhoto] = useState("");

  const handleSubmit = async(e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("driverId",driverId);
    formData.append("driverName",driverName);
    formData.append("phoneNumber",phoneNumber);
    formData.append("photo",photo);

    await axios.post(
      "http://localhost:5000/api/drivers/add",
      formData,
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("Driver Added");
  };

  return(

    <div>

      <h2>Add Driver</h2>

      <form onSubmit={handleSubmit}>

        <input
        placeholder="Driver ID"
        onChange={(e)=>setDriverId(e.target.value)}
        />

        <input
        placeholder="Driver Name"
        onChange={(e)=>setDriverName(e.target.value)}
        />

        <input
        placeholder="Phone Number"
        onChange={(e)=>setPhoneNumber(e.target.value)}
        />

        <input
        type="file"
        onChange={(e)=>setPhoto(e.target.files[0])}
        />

        <button>Add Driver</button>

      </form>

    </div>
  );
}

export default AddDriver;