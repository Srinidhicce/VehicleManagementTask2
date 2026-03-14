import { useEffect,useState } from "react";
import axios from "axios";

function DriverList(){

  const [drivers,setDrivers] = useState([]);

  const fetchDrivers = async()=>{

    const res = await axios.get(
      "http://localhost:5000/api/drivers/list",
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setDrivers(res.data);
  };

  const deleteDriver = async(id)=>{

    await axios.delete(
      `http://localhost:5000/api/drivers/delete/${id}`,
      {
        headers:{
          Authorization:`Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    fetchDrivers();
  };

  useEffect(()=>{
    fetchDrivers();
  },[]);

  return(

    <div>

      <h2>Driver List</h2>

      <table border="1">

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Photo</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

        {drivers.map((driver)=>(
          <tr key={driver._id}>

            <td>{driver.driverId}</td>

            <td>{driver.driverName}</td>

            <td>{driver.phoneNumber}</td>

            <td>
              <img
              src={`http://localhost:5000/uploads/driverPhotos/${driver.photo}`}
              width="80"
              />
            </td>

            <td>
              <button onClick={()=>deleteDriver(driver._id)}>
                Delete
              </button>
            </td>

          </tr>
        ))}

        </tbody>

      </table>

    </div>
  );
}

export default DriverList;