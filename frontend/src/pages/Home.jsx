import { Link } from "react-router-dom";

function Home(){

  return(

    <div>

      <h2>Driver Management</h2>

      <Link to="/add-driver">
        <button>Add Driver</button>
      </Link>

      <Link to="/drivers">
        <button>View Drivers</button>
      </Link>

    </div>
  );
}

export default Home;