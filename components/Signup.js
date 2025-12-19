import styles from "../styles/Signin_Signup.module.css";
import ReactModal from "react-modal";
import { FaTimes, FaEye, FaImage } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { login } from "../reducers/user";
import { useEffect } from "react";

function Signup(props) {
  // états pour les champs du formulaire
  const [userNom, setUserNom] = useState("");
  const [userPrenom, setUserPrenom] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEnseigne, setUserEnseigne] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordConfirm, setUserPasswordConfirm] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  // message de confirmation d'upload
  const [photoUploaded, setPhotoUploaded] = useState(false);

  // reset du message de confirmation après 2 secondes
  useEffect(() => {
    if (!photoUploaded) return;
    const timer = setTimeout(() => setPhotoUploaded(false), 2000);
    return () => clearTimeout(timer);
  }, [photoUploaded]);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleSignup = () => {
    if (userPassword !== userPasswordConfirm) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }
    console.log("avatarFile", avatarFile);
    fetch("http://localhost:3000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastname: userNom,
        firstname: userPrenom,
        mail: userEmail,
        tel: userPhone,
        restaurantName: userEnseigne,
        password: userPassword,
      }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        if (data.result) {
          // Si un avatar a été sélectionné, l'uploader sur Cloudinary
          if (avatarFile) {
            const formData = new FormData();
            formData.append("avatar", avatarFile);
            await fetch(`http://localhost:3000/users/avatar/${data.id}`, {
              method: "PUT",
              body: formData,
            });
          }

          dispatch(
            login({
              token: data.token,
              id: data.id,
              avatar: data.avatar ?? null,
            })
          );
          router.push("/dashboard");
          console.log("Success:", data);
        } else {
          alert(data.error);
          console.error("Error:", data.error);
        }
      });
  };

  return (
    <ReactModal
      isOpen={props.signUpVisible}
      closeTimeoutMS={250}
      style={{
        overlay: {
          position: "fixed",
          top: "5%",
          left: "25%",
          right: "25%",
          bottom: "5%",
          backgroundColor: "#f3f2eada",
        },
        content: {
          position: "absolute",
          top: "20px",
          left: "40px",
          right: "40px",
          bottom: "20px",
          border: "1px solid #ccc",
          background: "#f3f2eaff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
        },
      }}
    >
      <div className={styles.cross}>
        <FaTimes
          size={20}
          className={styles.crossColor}
          onClick={() => props.setSignUpVisible(false)}
        />
        ​
      </div>
      <div className={styles.modalContent}>
        <h1 style={{ color: "color-mix(in srgb, #341302 90%, white)" }}>
          Bienvenue
        </h1>
        <input
          className={styles.inputs}
          type="text"
          placeholder="Nom"
          onChange={(e) => {
            setUserNom(e.target.value);
          }}
        />
        <input
          className={styles.inputs}
          type="text"
          placeholder="Prénom"
          onChange={(e) => {
            setUserPrenom(e.target.value);
          }}
        />
        <input
          className={styles.inputs}
          type="text"
          placeholder="Adresse e-mail"
          onChange={(e) => {
            setUserEmail(e.target.value);
          }}
        />
        <input
          className={styles.inputs}
          type="text"
          placeholder="Numéro de téléphone"
          onChange={(e) => {
            setUserPhone(e.target.value);
          }}
        />
        <input
          className={styles.inputs}
          type="text"
          placeholder="Nom de l'enseigne"
          onChange={(e) => {
            setUserEnseigne(e.target.value);
          }}
        />
        <div className={styles.inputsPasswordsWrapper}>
          <input
            className={styles.inputsPasswords}
            type={passwordVisible ? "text" : "password"}
            placeholder="Mot de passe"
            onChange={(e) => {
              setUserPassword(e.target.value);
            }}
          />
          <FaEye
            color={passwordVisible ? "#D4AF37" : "black"}
            className={styles.eyeIcon}
            onClick={() => setPasswordVisible(!passwordVisible)}
          />
        </div>
        <div className={styles.inputsPasswordsWrapper}>
          <input
            className={styles.inputsPasswords}
            type={passwordConfirmVisible ? "text" : "password"}
            placeholder="Confirmation mot de passe"
            onChange={(e) => {
              setUserPasswordConfirm(e.target.value);
            }}
          />
          <FaEye
            color={passwordConfirmVisible ? "#D4AF37" : "black"}
            className={styles.eyeIcon}
            onClick={() => setPasswordConfirmVisible(!passwordConfirmVisible)}
          />
        </div>
        <div
          style={{ display: "flex", alignItems: "center" }}
          className={styles.inputs}
        >
          <label htmlFor="files" style={{ fontSize: 15, marginLeft: "3px" }}>
            {" "}
            Ajouter une photo de profil (facultatif)
          </label>
          <input
            id="files"
            style={{ display: "none" }}
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              setAvatarFile(file); // stocker le fichier dans l'état
              setPhotoUploaded(true); // message de confirmation d'upload
              e.target.value = ""; // reset input (important)
            }}
          />
          <FaImage
            onClick={() => {
              document.getElementById("files").click();
            }}
            style={{ marginLeft: "20.5%", cursor: "pointer" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            position: "relative",
            height: 20,
            width: "50%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {photoUploaded && (
            <div
              className={styles.fadeIn}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                color: "green",
                fontSize: 15,
                justifySelf: "center",
                alignSelf: "center",
              }}
            >
              Photo chargée ! ✅
            </div>
          )}
        </div>
      </div>
    </ReactModal>
  );
}

export default Signup;
