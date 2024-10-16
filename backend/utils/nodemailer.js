import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = (email, token) => {
  const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<h2>Verify your email to activate your account</h2>
               <p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

export const sendJobAlertsToCandidates = async (candidateEmails, job) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = candidateEmails.map((email) => ({
    from: process.env.EMAIL,
    to: email,
    subject: `New Job Opportunity: ${job.title}`,
    html: `
      <h2>New Job Opportunity: ${job.title}</h2>
      <p>${job.description}</p>
      <p>Experience Level: ${job.experienceLevel}</p>
      <p>Apply before: ${new Date(job.endDate).toLocaleDateString()}</p>
    `,
  }));

  // Send all emails asynchronously
  try {
    await Promise.all(
      mailOptions.map((options) => transporter.sendMail(options))
    );
    console.log("Job alert emails sent to candidates.");
  } catch (error) {
    console.error("Failed to send job alert emails:", error);
  }
};
