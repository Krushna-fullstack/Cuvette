import React from "react";
import CreateJob from "./CreateJob";
import AllJobs from "./AllJobs";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div>
      {authUser && authUser.role === "company" && <CreateJob />}

      <AllJobs />
    </div>
  );
};

export default Home;
