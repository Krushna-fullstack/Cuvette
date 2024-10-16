import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { sendJobAlertsToCandidates } from "../utils/nodemailer.js";

export const createJob = async (req, res) => {
  const { title, description, experienceLevel, candidateEmails, endDate } =
    req.body;

  if (!endDate || isNaN(new Date(endDate).getTime())) {
    return res.status(400).json({ error: "Invalid or missing endDate" });
  }

  try {
    const job = new Job({
      title,
      description,
      experienceLevel,
      postedBy: req.user.id,
      endDate: new Date(endDate),
    });
    await job.save();

    const candidates = await User.find({ role: "candidate" });

    const candidateEmails = candidates.map((candidate) => candidate.email);

    if (candidateEmails.length > 0) {
      await sendJobAlertsToCandidates(candidateEmails, job);
    }

    res
      .status(201)
      .json({ message: "Job created and emails sent to candidates!", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate({
      path: "postedBy",
      select: "-password",
    });

    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const applyForJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.applicants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ error: "You have already applied for this job" });
    }

    job.applicants.push(req.user.id);
    await job.save();

    res.status(200).json({ message: "Applied successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete jobs you posted" });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
