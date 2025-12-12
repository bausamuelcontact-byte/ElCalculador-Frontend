import styles from "../styles/RecipeSteps.module.css";

function RecipeSteps({ steps, editMode, newSteps, setNewSteps}) {

  const handleChange = (index, value) => {
    setNewSteps(prev => {
      const copy = [...prev];
      copy[index] = value.trim() === "" ? "" : value; // vide → pas compté
      return copy;
    });
  };

  if (!editMode) {
    return (
      <div className={styles.table}>
        {steps.map((desc, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.step}>Étape {index + 1}</div>
            <div className={styles.description}>{desc}</div>
          </div>
        ))}
      </div>
    );
  }
  else {
   return (
    <div className={styles.table}>
      {newSteps.map((desc, index) => (
        <div className={styles.row} key={index}>
          <div className={styles.step}>Étape {index + 1}</div>
          <div className={styles.description}>
              <input
                className={styles.inputs}
                placeholder={`Description étape ${index + 1}...`}
                value={desc}
                onChange={(e) => handleChange(index, e.target.value)}
              />
          </div>
        </div>
      ))}
    </div>
  );
  }
}

export default RecipeSteps;