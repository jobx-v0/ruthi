import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import Nav from "../core/Nav";

function ChatBotUI() {
  const [companies, setCompanies] = useState([]);
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [skeletonCompaniesLoading, setSkeletonCompaniesLoading] =
    useState(false);
  const [skeletonMessagesLoading, setSkeletonMessagesLoading] = useState(false);
  const [activeJobId, setActiveJobId] = useState();

  const [displayDatePicker, setDisplayDatePicker] = useState(false);
  const [displayTimePicker, setDisplayTimePicker] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const { authToken } = useAuth();
  const chatContainerRef = useRef(null);

  const location = useLocation();
  const { job_id, company_name } = location.state || {};

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchJobs = async () => {
    setSkeletonCompaniesLoading(true);

    try {
      const res = await axios.get(`http://localhost:8000/api/getcompanies`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      let jobs = res.data.jobs.filter((job) => job._id !== job_id);
      if (company_name && job_id)
        jobs.push({ company_name: company_name, _id: job_id });
      setCompanies(jobs);
      setActiveJobId(job_id);
    } catch (error) {
      console.error(error);
    } finally {
      setSkeletonCompaniesLoading(false);
    }
  };

  useEffect(() => {
    setActiveJobId(job_id);
    fetchJobs();
  }, []);

  const fetchHistory = async (job_id) => {
    setSkeletonMessagesLoading(true);
    try {
      // Fetch the conversation history based on the job_id
      const res = await axios.get(
        `http://localhost:8000/api/chathistory/${job_id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(res.data.nextOptions);
      // Set up the chat messages
      const messages = res.data?.chatHistory?.length
        ? res.data.chatHistory.map((msg) => ({
            sender: msg.sender,
            text: msg.message,
          }))
        : [{ sender: "Bot", text: "Would you like to schedule an interview?" }];
      setMessages(messages);

      // Set up options
      const options = res.data?.nextOptions?.length
        ? res.data.nextOptions.map((opt) => ({
            text: opt.text,
            value: opt.value,
          }))
        : [{ text: "Yes", value: "schedule" }];
      setOptions(options);

      // Reset date and time inputs
      setDate("");
      setTime("");

      // Reset display states for date and time pickers
      setDisplayDatePicker(false);
      setDisplayTimePicker(false);

      // Check if nextOptions includes 'input-date' or 'input-time'
      if (options.some((opt) => opt.value === "input-date")) {
        setDisplayDatePicker(true);
        setDisplayTimePicker(false);
      } else if (options.some((opt) => opt.value === "input-time")) {
        setDisplayDatePicker(false);
        setDisplayTimePicker(true);
      } else {
        // Hide both if neither input is required
        setDisplayDatePicker(false);
        setDisplayTimePicker(false);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setSkeletonMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (job_id) fetchHistory(job_id);
    setDate("");
    setTime("");

    setDisplayDatePicker(false);
    setDisplayTimePicker(false);
  }, [job_id]);

  const handleCompanyClick = async (job_id) => {
    setDisplayDatePicker(false);
    setDisplayTimePicker(false);
    fetchHistory(job_id);
    setActiveJobId(job_id);
  };

  const handleUserResponse = async (response) => {
    // Ensure date or time is selected before proceeding if required
    if (response.value === "input-date" && !date) {
      alert("Please select a date.");
      return;
    }
    if (response.value === "input-time" && !time) {
      alert("Please select a time.");
      return;
    }

    // Add the user's response to the chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "User", text: response.text },
    ]);
    setLoading(true);

    try {
      // Send the user response to the server
      const res = await axios.post(
        "http://localhost:8000/api/get-next-options",
        {
          job_id: activeJobId,
          userResponseValue: response.value || null,
          userResponseText: response.text || null,
          date: date || null,
          time: time || null,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Add the bot's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", text: res.data.nextMessage },
      ]);

      // Check if the next step requires a date or time input and update states accordingly
      const nextValue = res.data?.value;
      console.log("Next value:", nextValue);
      setDisplayDatePicker(nextValue === "input-date");
      setDisplayTimePicker(nextValue === "input-time");

      // Set the next options for the user
      setOptions(res.data.nextOptions || []);
    } catch (error) {
      console.error("Error fetching next options:", error);

      // Handle errors in chat with a retry option
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", text: "An error occurred. Please try again." },
      ]);
      setOptions([{ text: "Retry", value: "schedule" }]);
    } finally {
      setLoading(false);
    }
  };

  const convertToAnchorTags = (text) => {
    // Ensure the input is a string before calling split
    if (typeof text !== "string") {
      console.error("Expected a string, but received:", typeof text);
      return null;
    }

    // Regular expression to match URLs
    const urlRegex = /https?:\/\/[^\s]+/g;

    // Replace URLs with anchor tags or display them as text based on the domain
    return text.split("\n").map((line, index) => {
      const matches = line.match(urlRegex);
      if (matches) {
        const url = matches[0];

        // Check if the URL belongs to localhost:3000
        if (url.includes("localhost:3000")) {
          return (
            <p key={index}>
              {" "}
              Here is your{" "}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                meeting link
              </a>{" "}
              {/* Display as plain text */}
            </p>
          );
        } else {
          return (
            <p key={index}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {url}
              </a>{" "}
              {/* Display as a clickable link */}
            </p>
          );
        }
      }

      // Otherwise, return the line as plain text
      return <p key={index}>{line}</p>;
    });
  };

  return (
    <div
      className="bg-gray-900 bg-opacity-50 flex items-center justify-center flex-col overflow-y-hidden"
      style={{ height: "100vh" }}
    >
      <Nav />
      <div className="relative w-full h-full bg-white shadow-lg flex overflow-y-hidden">
        <aside className="w-1/4 p-4 border-r border-gray-200 flex flex-col bg-gray-50">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Applied Companies
          </h2>
          {skeletonCompaniesLoading ? (
            <div class="space-y-2 w-full">
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
              <div class="bg-gray-200 rounded h-10 w-full animate-pulse"></div>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1">
              <ul className="overflow-y-auto">
                {companies?.length !== 0 ? (
                  companies?.map((company, index) => (
                    <li
                      key={index}
                      className={`mb-2 p-2 ${
                        activeJobId === company._id
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100"
                      } rounded cursor-pointer hover:bg-orange-400`}
                      onClick={() => handleCompanyClick(company._id)}
                    >
                      {company.company_name}
                    </li>
                  ))
                ) : (
                  <>
                    <li>You didn't apply to any company</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </aside>

        {/* Chat Area */}
        <main className="flex-1 p-4 overflow-y-hidden">
          <h1 className="text-2xl font-bold mb-4">Schedule an Interview</h1>
          {skeletonMessagesLoading ? (
            <div
              class="flex-1 p-6 bg-gray-100 rounded"
              style={{ height: "78vh", overflowY: "auto" }}
            >
              <div class="flex space-x-2">
                <div class="bg-gray-300 rounded-lg h-8 w-48 animate-pulse"></div>
              </div>
              <div class="flex justify-end space-x-2">
                <div class="bg-blue-400 rounded-lg h-8 w-24 animate-pulse"></div>
              </div>
              <div class="flex space-x-2">
                <div class="bg-gray-300 rounded-lg h-8 w-56 animate-pulse"></div>
              </div>
              <div class="flex justify-end space-x-2">
                <div class="bg-blue-400 rounded-lg h-8 w-32 animate-pulse"></div>
              </div>
              <div class="flex space-x-2">
                <div class="bg-gray-300 rounded-lg h-8 w-48 animate-pulse"></div>
              </div>
              <div class="flex justify-end space-x-2">
                <div class="bg-blue-400 rounded-lg h-8 w-24 animate-pulse"></div>
              </div>
              <div class="flex space-x-2">
                <div class="bg-gray-300 rounded-lg h-8 w-56 animate-pulse"></div>
              </div>
              <div class="flex justify-end space-x-2">
                <div class="bg-blue-400 rounded-lg h-8 w-32 animate-pulse"></div>
              </div>
              <div class="flex space-x-2">
                <div class="bg-gray-300 rounded-lg h-8 w-48 animate-pulse"></div>
              </div>
              <div class="flex justify-end space-x-2">
                <div class="bg-blue-400 rounded-lg h-8 w-32 animate-pulse"></div>
              </div>
              <div class="flex space-x-2">
                <div class="bg-gray-300 rounded-lg h-8 w-48 animate-pulse"></div>
              </div>
              <div class="flex justify-end space-x-2">
                <div class="bg-blue-400 rounded-lg h-8 w-32 animate-pulse"></div>
              </div>
              <div class="flex space-x-2">
                <div class="bg-gray-300 rounded-lg h-8 w-56 animate-pulse"></div>
              </div>
              <div class="flex justify-end space-x-2">
                <div class="bg-blue-400 rounded-lg h-8 w-24 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div
              ref={chatContainerRef}
              className="flex-1 p-6 bg-gray-100 rounded"
              style={{ height: "78vh", overflowY: "auto" }}
            >
              {messages?.length === 0 ? (
                <p class="text-gray-600 text-center">
                  Please select a company to schedule an interview.
                </p>
              ) : (
                messages?.map((message, index) => (
                  <div
                    key={index}
                    className={`flex mb-2 ${
                      message.sender === "Bot" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`${
                        message.sender === "Bot"
                          ? "bg-gray-300 text-gray-800"
                          : "bg-blue-500 text-white"
                      } p-2 rounded-lg max-w-xs`}
                    >
                      {convertToAnchorTags(message.text)}
                    </div>
                  </div>
                ))
              )}

              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {displayDatePicker && (
                    <input
                      type="date"
                      value={date}
                      placeholder="Select date"
                      onChange={(e) => setDate(e.target.value)}
                      className="mb-4 p-2 border rounded"
                    />
                  )}
                  {displayTimePicker && (
                    <input
                      type="time"
                      value={time}
                      placeholder="Select time"
                      onChange={(e) => setTime(e.target.value)}
                      className="mb-4 p-2 border rounded"
                    />
                  )}
                  <div className="mt-4 space-x-2">
                    {options?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleUserResponse(option)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ChatBotUI;
