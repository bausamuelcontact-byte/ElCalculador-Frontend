import React, { useState, useEffect } from "react";
import styles from "../styles/Category.module.css";
import ReactModal from "react-modal";
import { FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { MdEdit, MdDeleteOutline  } from "react-icons/md";
import { Button, Input } from 'antd';
import {  setCategories, addCategory, removeCategory  } from '../reducers/categories';

function Category(props) {
  const userInfo = useSelector((state) => state.user.value);
  const categoryList = useSelector((state) => state.categories.value);

  const dispatch = useDispatch();
  // const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [updatedCat, setUpdatedCat] = useState("");
  const [updatedCatId, setUpdatedCatId] = useState(null);
 

     useEffect(() => {
       fetch(`http://localhost:3000/categories/${userInfo.id}`)
         .then((response) => response.json())
         .then((data) => {
           dispatch(setCategories(data.categories))
          //  setCategoryList(data.categories);
         });}, [userInfo.id, categoryName, updatedCat]);

  const handleAddCategory = () => {
    fetch(`http://localhost:3000/categories/add/${userInfo.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({
        name: categoryName,
        user: userInfo.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(addCategory(data.category));
          setCategoryName("");
        } else {
          alert("Error adding category" );
        }
      })    
};

 const handleUpdateCat = () => {
    fetch(`http://localhost:3000/categories/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({
          categoryId: updatedCatId,
          name: updatedCat,
        }),
    })
      .then((response) => response.json())
        .then((data) => {
            if (data.result) {
                // Update local state
                setCategoryList((prev) =>
                     prev.map((cat) =>cat._id === updatedCatId ? { ...cat, name: updatedCat } : cat));
                setUpdatedCatId(null);
                setUpdatedCat("");
            } else {
                alert("Error updating category");
            }
        })
  };
  const openUpdateCat = (cat)=>{ setUpdatedCatId(cat._id); setUpdatedCat(cat.name);}
  const cancelUpdateCat = () => { setUpdatedCatId(null); setUpdatedCat(""); }

  const handleRemoveCat = (catId)=>{
   fetch(`http://localhost:3000/categories/remove/${catId}`,
    { method: "DELETE",})
    .then((response) => response.json())
    .then((data) => {
        //    console.log(data);            
           dispatch(removeCategory(catId));}
        )}

  return (
    <ReactModal 
      isOpen={props.catModalVisible}
      closeTimeoutMS={250}
      style={{
        overlay: {
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          position: "relative",
          inset: "40px",  
          border: "none",
          overflow: "hidden",
          padding: "0",
          border: "1px solid #ccc",
          background: "#fff",
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          
        },
      }}
    >

             <div className={styles.modalContent}>
                <FaTimes size={20} className={styles.crossColor} onClick={() => props.setCatModalVisible(false)} />
                <h1>Catégories</h1>
                {categoryList?.map((cat) => (
                    <div key={cat._id} className={styles.catItem}>
                        <div key={cat._id} className={styles.catName}>
                        <span className={styles.catLabel}>{cat.name} </span>

                        <div className={styles.catActions}>
                          <MdEdit style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => openUpdateCat(cat)} /> 
                             <MdDeleteOutline style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => handleRemoveCat(cat._id)}/>
                        </div>
                        </div>
                           {updatedCatId === cat._id && (<div >
                          <Input value={updatedCat} placeholder={cat.name} onChange={(e) => {setUpdatedCat(e.target.value); }}/>
                          <Button type="primary" onClick={handleUpdateCat}>
                  Modifier
                </Button>
                <Button style={{ marginLeft: "5px" }} onClick={cancelUpdateCat}>
                  Annuler
                </Button>

                         </div> )}
                       
                    </div>
                ))}

                <Input
                  className={styles.inputs}
                  type="text"
                  placeholder="Créez une nouvelle catégorie"
                  value = {categoryName}
                  onChange={(e) => { setCategoryName(e.target.value); }}
                />
                <Button type="primary" onClick={handleAddCategory}>
            Ajouter la catégorie
          </Button>
              </div>
    
    </ReactModal>
  )
};

export default Category;