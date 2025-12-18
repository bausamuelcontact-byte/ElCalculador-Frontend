import React from "react";
import styles from "../styles/Menu.module.css";

import { MdAddChart } from "react-icons/md";
import { MdOutlineRestaurant } from "react-icons/md";
import { MdLocalGroceryStore } from "react-icons/md";
import { MdOutlineCardMembership } from "react-icons/md";

import { MdEuro } from "react-icons/md";

function Menu({}) {
  const MenuData = [
    {
      title: "Dashboard",
      icon: <MdAddChart />,
      link: "/dashboard",
    },
    {
      title: "Recipes",
      icon: <MdOutlineRestaurant />,
      link: "/recipe",
    },
    {
      title: "Ingredients",
      icon: <MdLocalGroceryStore />,
      link: "/ingredient",
    },
    {
      title: "Recipes Cards",
      icon: <MdOutlineCardMembership />,
      link: "/recipecard",
    },

  ];
  return (
    <div className={styles.Menu}>
      {MenuData.map((data, i) => {
        return (
          <div
            key={i}
            onClick={() => (window.location.href = data.link)}
            className={styles.pageName}
          >
            <div className={styles.icon}> {data.icon}</div>
            <div className={styles.page}>{data.title}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Menu;
