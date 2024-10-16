import { Router } from "express";
import {
  applyForJob,
  createJob,
  deleteJob,
  getJobs,
} from "../controllers/job.controller.js";
import { isAuthenticated, isCompany } from "../middlewares/auth.js";

const router = Router();

router
  .route("/")
  .post(isAuthenticated, isCompany, createJob)
  .get(isAuthenticated, getJobs);

router.post("/:jobId/apply", isAuthenticated, applyForJob);
router.delete("/:jobId", isAuthenticated, isCompany, deleteJob);

export default router;
