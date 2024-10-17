import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AiFillDelete } from "react-icons/ai"; // Import the delete icon
import toast from "react-hot-toast";

const AllJobs = () => {
  // Fetch the authenticated user
  const fetchAuthUser = async () => {
    const response = await fetch("/api/v1/auth/me");
    if (!response.ok) {
      throw new Error("Failed to fetch auth user");
    }
    return response.json();
  };

  const {
    data: authUser,
    error: authError,
    isLoading: authLoading,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
  });

  // Fetch the jobs data
  const {
    data: jobsData,
    error: jobsError,
    isLoading: jobsLoading,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await fetch("/api/v1/jobs");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      return data.jobs;
    },
  });

  const applyForJob = async (jobId) => {
    try {
      const response = await fetch(`/api/v1/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply for job");
      }

      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete job");
      }

      toast.success(data.message);
      // Optionally refetch jobs here to update the list
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (authLoading || jobsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-lg">Loading data...</h2>
      </div>
    );
  }

  if (authError) {
    toast.error(authError.message);
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-lg text-red-500">Error fetching user</h2>
      </div>
    );
  }

  if (jobsError) {
    toast.error(jobsError.message);
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-lg text-red-500">Error fetching jobs</h2>
      </div>
    );
  }

  if (!Array.isArray(jobsData)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-lg text-red-500">No jobs available</h2>
      </div>
    );
  }

  // Debugging logs
  console.log("Auth User:", authUser);
  console.log("Jobs Data:", jobsData);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">All Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobsData.map((job) => (
          <div
            key={job._id}
            className="relative bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
          >
            {job.postedBy?._id === authUser?._id && ( // Ensure job.postedBy and authUser are defined
              <button
                className="absolute top-2 right-2 p-1 rounded-md bg-red-600 text-white hover:bg-red-500 transition"
                onClick={() => deleteJob(job._id)}
              >
                <AiFillDelete className="h-5 w-5" /> {/* Smaller delete icon */}
              </button>
            )}
            <h2 className="text-lg font-semibold text-indigo-600">
              {job.title}
            </h2>
            <p className="text-gray-700 mt-2">{job.description}</p>
            <p className="text-gray-500 mt-2">
              Experience Level: {job.experienceLevel}
            </p>
            <p className="text-gray-500 mt-2">
              End Date: {new Date(job.endDate).toLocaleDateString()}
            </p>
            <p className="text-gray-500 mt-2">
              Posted By: {job.postedBy?.email || "Unknown"}
            </p>

            <button
              className={`mt-4 py-2 px-4 rounded-md transition ${
                job.applicants.includes(authUser?._id)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
              onClick={() => applyForJob(job._id)}
              disabled={job.applicants.includes(authUser?._id)} // Disable if already applied
            >
              {job.applicants.includes(authUser?._id) ? "Applied" : "Apply Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllJobs;
