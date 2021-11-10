import React, { useState } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { useDropzone } from "react-dropzone";
import { showMessage } from "app/store/actions";
import jwtService from "app/services/originServices/jwtService";
import { withFormsy } from "formsy-react";
import { useDispatch } from "react-redux";

const useStyles = makeStyles(() => ({
  rootDropContainer: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    minWidth: "0px",
    color: "#e01b1b",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif",
    "> em": {
      fontSize: ".8rem",
    },
  },
  containerEM: {
    fontSize: ".8rem",
  },
  dropzone: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    margin: "15px 0px",
    borderWidth: "2px",
    borderRadius: "2px",
    borderColor: "#d5d5d5",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "black",
    boxShadow: "inset 0 0 0 1000px rgba(255, 255, 255, 0.67)",
    outline: "none",
    textAlign: "center",
    backgroundSize: "cover",
    transition:
      "border .24s ease-in-out, color .24s ease-in-out, box-shadow .24s ease-in-out",
    "&:hover": {
      color: "#424242",
      borderColor: "#424242",
      boxShadow: "inset 0 0 0 1000px rgba(255, 255, 255, 1)",
      borderStyle: "solid",
    },
    "&:focus": {
      borderColor: "#2196f3",
    },
  },
}));

function CoverImageEditor(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { elementId, value } = props;
  const [loading, setLoading] = useState(false);

  const alert = (message, variant) => {
    dispatch(showMessage({ message, variant }));
  };

  // Handel file upload
  const handelDropFile = (file) => {
    setLoading(true);
    if (!file[0]) {
      setLoading(false);
      alert("L'image est trop grande", "error");
    } else {
      jwtService
        .uploadImage(file[0], "menu-categories", elementId)
        .then((response) => {
          // Show a message
          alert("La photo est mise en ligne", "success");
          // Handle value
          props.setValue(response);
          if (typeof onChange === "function") {
            props.onChange(response);
          }
        })
        .catch((error) => {
          let message = "Erreur avec votre image";
          if (error[0] && error[0].message)
            message = error[0].message;
          alert(message, "error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handelImageRemoval = () => {
    props.setValue(null);
    if (typeof onChange === "function") {
      props.onChange(null);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    maxSize: 2.5 * 1080 * 1080, // 2,5 MB max size
    multiple: false,
    noKeyboard: true,
    onDrop: handelDropFile,
  });

  return (
    <div className={classes.rootDropContainer}>
      {value && (
        <Button
          className={classes.removeButton}
          onClick={handelImageRemoval}
        >
          <RemoveCircleIcon />
        </Button>
      )}
      <div
        {...getRootProps({ className: classes.dropzone })}
        style={{
          backgroundImage: `url(${value})`,
        }}
      >
        <input
          {...getInputProps()}
          id="options-edit-background-image"
        />

        {loading ? (
          <CircularProgress
            style={{
              fontSize: "4rem",
            }}
          />
        ) : (
          <CloudUploadIcon
            style={{
              fontSize: "4rem",
            }}
          />
        )}
        <p>Faites glisser un fichier image ici ou cliquez dessus</p>
        <em className={classes.containerEM}>
          (Seules les images *.jpeg et *.png seront acceptées de
          taille inférieur à 2,5 MB)
        </em>
      </div>
    </div>
  );
}

export default withFormsy(CoverImageEditor);
