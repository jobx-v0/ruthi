"use client";

import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import { competitionsState } from "../../store/atoms/userProfileSate";
import { Flag, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { competitionSchema } from "../../validators/ZodSchema";

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return dateString.substring(0, 7); // Return only YYYY-MM
};

export default function Competitions() {
  const [competitions, setCompetitions] = useRecoilState(competitionsState);
  const [expandedId, setExpandedId] = useState(null);
  const newItemRef = useRef(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Ensure competitions is an array before formatting
    if (Array.isArray(competitions)) {
      const formattedCompetitions = competitions.map(comp => ({
        ...comp,
        date: formatDateForInput(comp.date),
      }));
      setCompetitions(formattedCompetitions);
    } else {
      // Initialize with an empty array if competitions is undefined
      setCompetitions([]);
    }
  }, []); // Empty dependency array means this runs once on mount

  const getCurrentDate = () => {
    return new Date().toISOString().substring(0, 7); // Return only YYYY-MM
  };

  const validateField = (field, value, index) => {
    try {
      competitionSchema.shape[field].parse(value);
      setErrors(prev => ({...prev, [`${index}-${field}`]: null}));
    } catch (error) {
      setErrors(prev => ({...prev, [`${index}-${field}`]: error.errors[0].message}));
    }
  };

  const addCompetition = () => {
    const newCompetition = {
      id: Date.now().toString(),
      name: "",
      description: "",
      date: "",
    };
    setCompetitions([...competitions, newCompetition]);
    setTimeout(() => scrollToNewItem(), 100);
  };

  const removeCompetition = (id) => {
    setCompetitions(competitions.filter((competition) => competition.id !== id));
  };

  const scrollToNewItem = () => {
    newItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInputChange = (id, field, value) => {
    setCompetitions(prevCompetitions =>
      prevCompetitions.map((competition) =>
        competition.id === id ? { ...competition, [field]: value } : competition
      )
    );
    const index = competitions.findIndex(comp => comp.id === id);
    validateField(field, value, index);
  };

  const descriptionToBulletPoints = (description) => {
    if (!description || typeof description !== 'string') {
      return [];
    }
    return description.split('\n').filter(point => point.trim() !== '');
  };

  return (
    <div className="container mx-auto p-2 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Flag className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Competitions</h2>
            </div>
            <button
              onClick={addCompetition}
              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full"
              aria-label="Add competition"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {Array.isArray(competitions) && competitions.map((competition, index) => (
              <div
                key={competition.id}
                ref={index === competitions.length - 1 ? newItemRef : null}
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleExpand(competition.id)}
                      className="flex items-center space-x-2 text-left focus:outline-none"
                      aria-expanded={expandedId === competition.id}
                    >
                      {expandedId === competition.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                      <span className="font-medium">
                        {competition.name || "Untitled Competition"}
                      </span>
                    </button>
                    <button
                      onClick={() => removeCompetition(competition.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove competition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === competition.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label
                              htmlFor={`competition-name-${competition.id}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Competition Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id={`competition-name-${competition.id}`}
                              value={competition.name}
                              onChange={(e) => handleInputChange(competition.id, "name", e.target.value)}
                              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors[`${index}-name`] ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors[`${index}-name`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`${index}-name`]}</p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor={`competition-date-${competition.id}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Date <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="month"
                              id={`competition-date-${competition.id}`}
                              value={formatDateForInput(competition.date)}
                              max={getCurrentDate()}
                              onChange={(e) => handleInputChange(competition.id, "date", e.target.value)}
                              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors[`${index}-date`] ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors[`${index}-date`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`${index}-date`]}</p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor={`description-${competition.id}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Description (one per line)
                            </label>
                            <textarea
                              id={`description-${competition.id}`}
                              value={competition.description || ''}
                              onChange={(e) => handleInputChange(competition.id, "description", e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter competition details, one per line"
                            />
                          </div>
                          {competition.description && (
                            <div className="sm:col-span-2 mt-2">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Description Preview:
                              </h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {descriptionToBulletPoints(competition.description).map((point, index) => (
                                  <li key={index} className="text-sm text-gray-600">
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {(!Array.isArray(competitions) || competitions.length === 0) && (
              <p className="text-gray-500 text-center">No competitions added yet.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
