import styles from "../styles/Signin_Signup.module.css";
import ReactModal from "react-modal";
import { FaTimes, FaEye } from "react-icons/fa"; 
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";


function Signin(props) {
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSignin = () => {
    fetch("http://localhost:3000/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mail: userEmail,
        password: userPassword
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
      dispatch(login({ token: data.token }));
      router.push("/dashboard");
    } else {
      alert(data.error);
      console.error("Error:", data.error);
    }});
  } 

  return (
    <ReactModal isOpen={props.signInVisible} closeTimeoutMS={250}
      style={{
    overlay: {
      position: 'fixed',
      top: '10%',
      left: '25%',
      right: '25%',
      bottom: '35%',
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
    },
    content: {
      position: 'absolute',
      top: '20px',
      left: '40px',
      right: '40px',
      bottom: '20px',
      border: '1px solid #ccc',
      background: '#fff',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      borderRadius: '4px',
      outline: 'none',
      padding: '20px'
    }
  }} >
    <div className={styles.cross}>
        <FaTimes size={20} className={styles.crossColor} onClick={()=>(props.setSignInVisible(false))}/>
    ​</div>
    <div className={styles.modalContent}>
        <h1>Identification</h1>
        <input className={styles.inputs} type="text" placeholder="adresse e-mail" onChange={(e)=>{setUserEmail(e.target.value)}}/> 
        <div className={styles.inputsPasswordsWrapper}>
          <input className={styles.inputsPasswords} type={passwordVisible ? "text" : "password"} placeholder="Mot de passe" onChange={(e) => { setUserPassword(e.target.value) }}/>
          <FaEye color={passwordVisible ? "#D4AF37" : 'black'} className={styles.eyeIcon} onClick={() => setPasswordVisible(!passwordVisible)} />
        </div>
        <button className={styles.buttonSignin} onClick={()=>{handleSignin()}}>Se connecter</button>
    </div>

      
    </ReactModal>
  );
}

export default Signin;
