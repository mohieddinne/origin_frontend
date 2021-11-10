import React from "react";
import { FusePageSimple } from "@fuse";
import DashboardLayout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import { useSelector } from "react-redux";

const backgroundImage1 =
  "assets/images/backgrounds/Background_Image_dashbord3-min.jpg";

const styles = {
  container: {
    backgroundImage: `url(${backgroundImage1})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    width: "100%",
    height: "100vh",
  },
};

function Dashboard() {
  const expert = useSelector(({ auth }) => auth?.user?.data?.expert);

  return !expert ? (
    <div style={styles.container}></div>
  ) : (
    <FusePageSimple
      header={<PageHeader />}
      content={<DashboardLayout />}
    />
  );
}

export default Dashboard;
