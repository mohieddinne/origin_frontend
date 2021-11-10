import React from "react";
import SharedFilterSelect from "app/main/origin/components/filters-shared-fields/Select";
import SharedFilterDateInput from "app/main/origin/components/filters-shared-fields/Date";
import TextFieldFormsy from "@fuse/components/formsy/TextFieldFormsy";
import Ranger from "./Rangers/Ranger";
import HourRanger from "./Rangers/HourRanger";

function FieldDynamicComponent({ field }) {
  const type = field?.type || null;
  switch (type) {
    case "date":
      return <SharedFilterDateInput name={field.name} />;
    case "range":
      return <Ranger name={field.name} />;
    case "range_hour":
      return <HourRanger name={field.name} />;
    case "list":
      return (
        <SharedFilterSelect
          name={field.name}
          field={field}
          required={true}
        />
      );
    case "text":
      return (
        <TextFieldFormsy
          name={field.name}
          field={field}
          required={true}
        />
      );
    default:
      return null;
  }
}

export default FieldDynamicComponent;
