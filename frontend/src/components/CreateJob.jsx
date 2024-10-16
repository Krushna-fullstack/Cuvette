import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const CreateJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: createJob } = useMutation({
    mutationFn: async ({ title, description, experienceLevel, endDate }) => {
      try {
        const res = await fetch("api/v1/jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            experienceLevel,
            endDate,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Job created successfully");
      setTitle("");
      setDescription("");
      setExperienceLevel("");
      setEndDate("");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    createJob({ title, description, experienceLevel, endDate });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") setTitle(value);
    if (name === "description") setDescription(value);
    if (name === "experienceLevel") setExperienceLevel(value);
    if (name === "endDate") setEndDate(value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Create Job</h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="title"
            >
              Job Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter job title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="description"
            >
              Job Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter job description"
              rows="4"
              required
            />
          </div>

          {/* Experience Level */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="experienceLevel"
            >
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={experienceLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="" disabled>
                Select experience level
              </option>
              <option value="Internship">Internship</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="endDate"
            >
              Application End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={endDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
