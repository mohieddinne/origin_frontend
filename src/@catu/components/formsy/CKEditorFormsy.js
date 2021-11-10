import React from "react";
import { withFormsy } from "formsy-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CKEditorFormsy = React.forwardRef((props, ref) => {
  // const errorMessage = props.errorMessage;
  const value = props.value || "";

  function changeValue(value) {
    if (typeof props.valueHandler === "function") {
      value = props.valueHandler(value);
    }
    props.setValue(value);
    if (props.onChange) {
      props.onChange(value);
    }
  }

  return (
    <CKEditor
      {...props}
      editor={ClassicEditor}
      data={value}
      config={{}}
      onChange={(e, editor) => {
        const data = editor.getData();
        changeValue(data);
      }}
    />
  );
});

export default React.memo(withFormsy(CKEditorFormsy));
