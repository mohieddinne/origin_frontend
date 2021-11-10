import UserSystem from "./user-system/";
import { OptionsPageConfig } from "./misc/option/OptionsConfig";
import { SeaFilesAdminConfig } from "./third-party/seafiles-admin/SeaFilesAdminConfig";
import CoreModules from "./core";
import AdminHome from "./home";

const modules = [
  ...UserSystem,
  ...CoreModules,
  // Misc
  OptionsPageConfig,
  // Third party
  SeaFilesAdminConfig,
  // Home !important to be last
  AdminHome,
];

export default modules;
