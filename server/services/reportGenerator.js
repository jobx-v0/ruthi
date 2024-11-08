const fs = require("fs");
const path = require("path");
const Interview = require("../models/Interview");
const Job = require("../models/Job");
const Question = require("../models/Question");
const Result = require("../models/Result");
const User = require("../models/User");
const puppeteer = require("puppeteer");
const Handlebars = require("handlebars");
const AzureService = require("./azureService");

const deletePDF = async (deletePDF) => {
  const userIdDir = path.join(__dirname, "tempChunks", deletePDF);
  try {
    fs.rmSync(userIdDir, { recursive: true, force: true });
  } catch (err) {
    console.error(`Error deleting PDF file ${userIdDir}:`, err);
  }
};

const readHTML = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

const generateReport = async (interviewId) => {
  try {
    const result = await Result.findOne({ interview_id: interviewId });

    if (!result) {
      throw new Error("Result not found");
    }

    const interviewDoc = await Interview.findById(interviewId).select(
      "data user_id job_id"
    );

    const userDetailsDoc = await User.findById(interviewDoc?.user_id).select(
      "username email"
    );

    const jobDetailsDoc = await Job.findById(interviewDoc?.job_id).select(
      "skills_required"
    );

    const totalCommunication_skills = result?.total_score_in_each_category.get(
      "communication_skills"
    );
    const totalSubject_expertise =
      result?.total_score_in_each_category.get("subject_expertise");
    const totalRelevancy =
      result?.total_score_in_each_category.get("relevancy");

    const report = {
      username: userDetailsDoc.username,
      email: userDetailsDoc.email,
      resultId: result._id,
      skills_required: jobDetailsDoc.skills_required,
      totalCommunicationSkills: totalCommunication_skills,
      totalSubjectExpertise: totalSubject_expertise,
      totalRelevancy: totalRelevancy,
      totalScore: result.total_score.toFixed(2),
      finalTrustScore: result.final_trust_score,
      interviewTookAt: result.created_at,
      finalReview: result.final_review,
      questionDetails: [],
    };

    for (const questionScore of result.question_scores) {
      const questionDoc = interviewDoc.data.find(
        (q) => q.question.toString() === questionScore.question_id.toString()
      );

      if (questionDoc && questionDoc.question) {
        const question = await Question.findById(
          questionDoc?.question.toString()
        );

        const communication_skills = questionScore?.scores.get(
          "communication_skills"
        );
        const subject_expertise =
          questionScore?.scores.get("subject_expertise");
        const relevancy = questionScore?.scores.get("relevancy");

        report.questionDetails.push({
          question: question?.question,
          answer: questionDoc?.answer,
          communicationSkills: communication_skills,
          subjectExpertise: subject_expertise,
          relevancy: relevancy,
          feedback: questionScore?.feedback,
          review: questionScore?.review,
        });
      }
    }

    const tempDir = path.join(
      `${userDetailsDoc._id}`,
      `${jobDetailsDoc._id}`,
      `${interviewDoc._id}`
    );

    const createOutputPath = path.join(__dirname, "tempChunks", tempDir);

    AzureService.ensureDirectoryExists(createOutputPath);

    const finalOutputPath = path.join(
      createOutputPath,
      `Report${userDetailsDoc._id}${jobDetailsDoc._id}${interviewDoc._id}${result._id}.pdf`
    );

    const blobName = path.join(
      tempDir,
      `Report${userDetailsDoc._id}${jobDetailsDoc._id}${interviewDoc._id}${result._id}.pdf`
    );

    (async () => {
      const templateHTML = await readHTML(
        path.join(__dirname, "reportTemplate.html")
      );

      const template = Handlebars.compile(templateHTML);
      const html = template(report);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(html);

      await page.pdf({
        path: finalOutputPath,
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: `
    <div style="font-size:10px;width:100%;text-align:left;margin-left:20px;">
      <span class="date"></span>
    </div>`,
        footerTemplate:
          '<div style="font-size:10px;text-align:right;width:100%;margin-right:20px;">Powered by RuthiAI</div>',
        margin: {
          top: "60px",
          bottom: "60px",
        },
      });

      console.log("PDF generated successfully!");
      await browser.close();
    })();
    const deletePDF = path.join(
      `${userDetailsDoc._id}`,
      `${jobDetailsDoc._id}`
    );
    return { finalOutputPath, blobName, deletePDF };
  } catch (error) {
    console.error("Error generating report:", error);
  }
};

const ReportGenerateService = {
  generateReport,
  deletePDF,
};

module.exports = ReportGenerateService;
