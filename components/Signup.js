import styles from "../styles/Signin_Signup.module.css";
import ReactModal from "react-modal";
import { FaTimes, FaEye } from "react-icons/fa"; 
import { useState } from "react";

function Signup(props) {

  const [userNom, setUserNom] = useState("");
  const [userPrenom, setUserPrenom] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEnseigne, setUserEnseigne] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirm, setUserPasswordConfirm] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  const handleSignup = () => {
    if (userPassword !== userPasswordConfirm) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lastname: userNom,
        firstname: userPrenom,
        mail: userEmail,
        tel: userPhone,
        restaurantName: userEnseigne,
        password: userPassword
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.result) {
      alert("Votre compte a été créé avec succès !");
      console.log("Success:", data);
    } else {
      alert(data.error);
      console.error("Error:", data.error);
    }});
  }

  return (
    <ReactModal isOpen={props.signUpVisible} 
      closeTimeoutMS={250}
      style={{
    overlay: {
      position: 'fixed',
      top: '5%',
      left: '25%',
      right: '25%',
      bottom: '5%',
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
        <FaTimes size={20} className={styles.crossColor} onClick={()=>(props.setSignUpVisible(false))}/>
    ​</div>
    <div className={styles.modalContent}>
        <h1>Bienvenue</h1>
        <input className={styles.inputs} type="text" placeholder="Nom" onChange={(e)=>{setUserNom(e.target.value)}}/> 
        <input className={styles.inputs} type="text" placeholder="Prénom" onChange={(e)=>{setUserPrenom(e.target.value)}}/> 
        <input className={styles.inputs} type="text" placeholder="Adresse e-mail" onChange={(e)=>{setUserEmail(e.target.value)}}/>
        <input className={styles.inputs} type="text" placeholder="Numéro de téléphone" onChange={(e)=>{setUserPhone(e.target.value)}}/> 
        <input className={styles.inputs} type="text" placeholder="Nom de l'enseigne" onChange={(e)=>{setUserEnseigne(e.target.value)}}/>
        <div className={styles.inputsPasswordsWrapper}>
          <input className={styles.inputsPasswords} type={passwordVisible ? "text" : "password"} placeholder="Mot de passe" onChange={(e) => { setUserPassword(e.target.value) }}/>
          <FaEye color={passwordVisible ? "#D4AF37" : 'black'} className={styles.eyeIcon} onClick={() => setPasswordVisible(!passwordVisible)} />
        </div>
        <div className={styles.inputsPasswordsWrapper}>
          <input className={styles.inputsPasswords} type={passwordConfirmVisible ? "text" : "password"} placeholder="Confirmation mot de passe" onChange={(e) => { setUserPasswordConfirm(e.target.value) }}/> 
          <FaEye color={passwordConfirmVisible ? "#D4AF37" : 'black'} className={styles.eyeIcon} onClick={() => setPasswordConfirmVisible(!passwordConfirmVisible)}/>
        </div>
        <button className={styles.buttonSignin} onClick={()=>{handleSignup()}}>Créer un compte</button>
    </div>
    </ReactModal>
  );
}

export default Signup;
