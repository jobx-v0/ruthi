import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  RadioGroup,
  Radio,
  Button,
} from "@nextui-org/react";
import StringList from "./StringListInput";

const AddJobModal = ({ isOpen, onClose, onAddJob, initialJobData, onUpdateJob }) => {
  const [jobData, setJobData] = useState(
    initialJobData || {
      title: "",
      description: "",
      job_link: "",
      employment_type: "",
      location: "",
      skills_required: [],
      experience_required: 0,
      company_name: "",
      company_logo: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (initialJobData) {
      setJobData(initialJobData);
    }
  }, [initialJobData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddOrUpdateJob = async () => {
    setErrorMessage(""); // Reset error message
    // Input validation
    if (!jobData.title || !jobData.company_name) {
      setErrorMessage("Title and Company Name are required.");
      return; 
    }

    //if (isNaN(jobData.experience_required) || jobData.experience_required < 0) {
      //setErrorMessage("Experience required must be a non-negative number.");
      //return;
    //}

    //const urlPattern = new RegExp('^(https?://)?(www\\.)?[a-z0-9-]+(\\.[a-z]{2,})+(/[\\w-./?%&=]*)?$');
    //if (!urlPattern.test(jobData.job_link)) {
      //setErrorMessage("Invalid Job Link format.");
      //return;
    //}

    //if (!urlPattern.test(jobData.company_logo)) {
      //setErrorMessage("Invalid Company Logo URL format.");
      //return;
    //}

    setLoading(true); // Start loading state
    try {
      if (initialJobData) {
        await onUpdateJob(jobData); // Call update job function
      } else {
        await onAddJob(jobData); // Call add job function
      }
    } catch (error) {
      console.error("Error saving job data:", error);
      setErrorMessage("Error saving job data. Please try again.");
    } finally {
      setLoading(false); // End loading state
      handleCloseModal(); // Close modal after operation
    }
  };

  const handleCloseModal = () => {
    setJobData({
      title: "",
      description: "",
      job_link: "",
      employment_type: "",
      location: "",
      skills_required: [],
      experience_required: 0,
      company_name: "",
      company_logo: "",
    });
    setErrorMessage(""); // Reset error message
    onClose();
  };

  const handleAddSkillList = (newList) => {
    setJobData((prevObject) => ({
      ...prevObject,
      skills_required: newList,
    }));
  };

  const handleRadioChange = (value) => {
    setJobData((prevData) => ({
      ...prevData,
      employment_type: value,
    }));
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onClose={handleCloseModal}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[calc(100vh-40px)] overflow-y-auto"
    >
      <ModalContent>
        <ModalHeader>
          <h1 className="text-xl font-bold text-black mb-2">
            {initialJobData ? "Edit Job" : "Add Job"}
          </h1>
        </ModalHeader>
        <ModalBody>
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <Input
            label="Company Name"
            variant="flat"
            name="company_name"
            value={jobData.company_name}
            onChange={handleChange}
            placeholder="Company Name"
          />
          <Input
            label="Title"
            variant="flat"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            placeholder="Job Title"
          />
          <Textarea
            label="Description"
            variant="flat"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            placeholder="Job Description"
          />
          <Input
            label="Job Link"
            variant="flat"
            name="job_link"
            value={jobData.job_link}
            onChange={handleChange}
            placeholder="Job Link"
          />
          <Input
            label="Years of Experience Required"
            variant="flat"
            name="experience_required"
            value={jobData.experience_required}
            onChange={handleChange}
            placeholder="Years of Experience Required"
            type="number" // Ensure input is numeric
          />
          <Input
            label="Location"
            variant="flat"
            name="location"
            value={jobData.location}
            onChange={handleChange}
            placeholder="Remote/On-site"
          />
          <Input
            label="Company Logo Url"
            variant="flat"
            name="company_logo"
            value={jobData.company_logo}
            onChange={handleChange}
            placeholder="Company Logo Url"
          />
          <StringList
            stringList={jobData.skills_required}
            setStringList={handleAddSkillList}
            placeholder="Skills required"
            label="Skills required"
          />
          <RadioGroup
            style={{ marginLeft: "10px" }}
            label={<span style={{ fontSize: "12px" }}>Employment Type</span>}
            value={jobData.employment_type}
            onValueChange={handleRadioChange}
            orientation="horizontal"
          >
            <Radio value="full-time">Full-time</Radio>
            <Radio value="part-time">Part-time</Radio>
            <Radio value="intern">Intern</Radio>onAddJob 
          </RadioGroup>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleAddOrUpdateJob} disabled={loading}>
            {loading ? "Saving..." : initialJobData ? "Update Job" : "Add Job"}
          </Button>
          <Button ghost onClick={handleCloseModal}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddJobModal;
