import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";


const Login = () => {


  const navigate = useNavigate();


  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");




  const handleLogin = () => {



    if(password.length !== 4 && password.length !== 7){

      setError(
        "Password must be 4 digits for Admin or 7 digits for Student"
      );

      return;

    }



    if(!/^\d+$/.test(password)){


      setError(
        "Password must contain only numbers"
      );

      return;

    }




    setError("");



    // Admin login

    if(password.length === 4){

      navigate("/admin");

    }



    // Student login

    else if(password.length === 7){

      navigate("/student-dashboard");

    }


  };






  return (


    <div className="login-container">


      <div className="login-card">



        <div className="login-header">


          <div className="logo">

            🎓

          </div>



          <h1>

            Campus Management
            <br/>
            System

          </h1>



          <p>
            Portal Login
          </p>


        </div>





        <div className="form-group">


          <label>
            Username
          </label>



          <input

            type="text"

            value={username}

            onChange={(e)=>setUsername(e.target.value)}

            placeholder="Enter your username"

          />


        </div>






        <div className="form-group">


          <label>
            Password
          </label>



          <input

            type="password"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

            placeholder="Enter password"

          />


        </div>





        {
          error && (

            <p
              style={{
                color:"red",
                textAlign:"center",
                marginBottom:"10px"
              }}
            >

              {error}

            </p>

          )
        }





        <button

          className="login-button"

          onClick={handleLogin}

        >

          Login

        </button>






        <div className="login-footer">


          <p>

            © 2026 Campus Management System

          </p>


        </div>




      </div>


    </div>


  );


};


export default Login;