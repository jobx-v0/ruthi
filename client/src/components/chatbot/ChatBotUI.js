import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

function ChatBotUI({ handleApplyNow, job_id, company }) {
  const [companies, setCompanies] = useState([]);
  const [messages, setMessages] = useState();
  const [options, setOptions] = useState();
  const [loading, setLoading] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);

  const [displayDatePicker, setDisplayDatePicker] = useState(false);
  const [displayTimePicker, setDisplayTimePicker] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const { authToken } = useAuth();

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/getcompanies`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      let jobs = res.data.jobs.filter((job) => job._id !== job_id);
      console.log(company, job_id);

      jobs.push({ company_name: company, _id: job_id });

      setCompanies(jobs);
      setActiveJobId(job_id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchHistory = async (job_id) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/chathistory/${job_id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const messages = res.data?.chatHistory?.length
        ? res.data.chatHistory.map((msg) => ({
            sender: msg.sender,
            text: msg.message,
          }))
        : [{ sender: "Bot", text: "Would you like to schedule an interview?" }];

      setMessages(messages);

      const options = res.data?.nextOptions?.length
        ? res.data.nextOptions.map((opt) => ({
            text: opt.text,
            value: opt.value,
          }))
        : [{ text: "Yes", value: "schedule" }];

      setOptions(options);

      if (options[0].value === "input-date") {
        setDisplayDatePicker(true);
        setDisplayTimePicker(false);
      } else if (options[0].value === "input-time") {
        setDisplayDatePicker(false);
        setDisplayTimePicker(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory(job_id);
    setDate("");
    setTime("");
  }, [job_id]);

  const handleCompanyClick = async (job_id) => {
    setDisplayDatePicker(false);
    setDisplayTimePicker(false);
    fetchHistory(job_id);
    setActiveJobId(job_id);
  };

  const handleUserResponse = async (response) => {
    if (response.value === "input-date") {
      if (!date) {
        alert("Please select a date.");
        return;
      }
    } else if (response.value === "input-time") {
      if (!time) {
        alert("Please select a time.");
        return;
      }
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "User", text: response.text },
    ]);

    setLoading(true);
    console.log(response);

    try {
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

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", text: res.data.nextMessage },
      ]);

      if (res.data?.value) {
        if (res.data?.value === "date") {
          setDisplayDatePicker(true);
          setDisplayTimePicker(false);
        } else if (res.data?.value === "time") {
          setDisplayDatePicker(false);
          setDisplayTimePicker(true);
        }
      } else {
        setDisplayDatePicker(false);
        setDisplayTimePicker(false);
      }

      setOptions(res.data.nextOptions || []);
    } catch (error) {
      console.error("Error fetching next options:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "An error occurred. Please try again." },
      ]);
      setOptions([{ text: "Retry", value: "schedule" }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Click here.
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed z-10 inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="relative w-3/4 h-3/4 bg-white rounded-lg shadow-lg flex">
        <button
          onClick={handleApplyNow}
          className="absolute text-xl top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>

        <aside className="w-1/3 p-4 border-r border-gray-200">
          <h2 className="text-xl font-bold mb-4">Applied Companies</h2>
          <ul>
            {companies?.map((company, index) => (
              <li
                key={index}
                className={`mb-2 p-2 ${
                  activeJobId === company._id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100"
                } rounded hover:bg-orange-400 hover:text-white hover:cursor-pointer`}
                onClick={() => handleCompanyClick(company._id)}
              >
                {company.company_name}
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 flex flex-col p-4">
          <h1 className="text-2xl font-bold mb-4">Schedule an Interview</h1>
          <div
            ref={chatContainerRef} // Reference to the chat container
            className="flex-1 p-4 bg-gray-100 rounded shadow-inner overflow-y-auto"
          >
            {messages?.map((message, index) => (
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
                  {renderMessageText(message.text)}
                </div>
              </div>
            ))}

            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {displayDatePicker ? (
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                ) : null}

                {displayTimePicker ? (
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                ) : null}

                <div className="mt-4 flex space-x-2">
                  {options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleUserResponse(option)}
                      className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatBotUI;