import React from "react";
import reducer from "../store/reducer";
import withReducer from "app/store/withReducer";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { FusePageSimple } from "@fuse";
import MenuEditorWrapper from "../components/MenuEditorWrapper";
import MenuListWrapper from "../components/MenuListWrapper";
import PageHeader from "../components/PageHeader";
import Toolbar from "../components/Toolbar";

function List() {
  return (
    <FusePageSimple
      header={<PageHeader />}
      contentToolbar={<Toolbar />}
      content={
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-wrap px-16 mb-16">
            <div className="w-full md:w-1/2 lg:w-2/5 px-8">
              <div className="py-16 bg-gray-200 rounded-8">
                <MenuListWrapper />
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-3/5 mt-16 md:mt-0 px-8">
              <div className="px-16 pt-24 pb-32 sticky bg-gray-200 rounded-8">
                <MenuEditorWrapper />
              </div>
            </div>
          </div>
        </DndProvider>
      }
    />
  );
}

export default withReducer("navMenuAdmin", reducer)(List);
