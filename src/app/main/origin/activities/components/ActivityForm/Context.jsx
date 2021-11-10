import React, { useState } from "react";
import ActivityForm from "./ActivityForm";

const FormContext = React.createContext({});

export function FormContextContainer(props) {
  const [usedOnFolder, setUsedOnFolder] = useState(false);
  const [folder, setFolder] = useState(null);
  const [activityType, setActivityType] = useState(null);
  const [category, setCategory] = useState(null);

  return (
    <FormContext.Provider
      value={{
        folder,
        setFolder,
        usedOnFolder,
        setUsedOnFolder,
        activityType,
        setActivityType,
        category,
        setCategory,
      }}
    >
      <ActivityForm {...props} />
    </FormContext.Provider>
  );
}

export default FormContext;
