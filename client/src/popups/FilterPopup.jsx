// src/popups/FilterPopup.jsx - Updated

import React, { useState } from 'react';
import { X, GraduationCap, Layers, Calendar } from 'lucide-react';

export default function FilterPopup({ filters, onApply, onClose }) {
  const [localFilters, setLocalFilters] = useState(filters);

  // ✅ Updated courses list
  const courses = [
    "All", "BTech", "MTech", "BCA", "MCA", "BSc", "MSc", 
    "BBA", "MBA", "PhD", "Diploma", "B.Pharma", "M.Pharma"
  ];

  // ✅ Updated branches based on selected course
  const getBranches = (course) => {
    if (course === "Diploma" || course === "All" && localFilters.course === "Diploma") {
      return ["All", "Diploma CS", "Diploma IT", "Diploma EC", "Diploma EE", "Diploma ME"];
    }
    if (course === "B.Pharma" || course === "M.Pharma" || course === "All" && (localFilters.course === "B.Pharma" || localFilters.course === "M.Pharma")) {
      return ["All", "Pharmaceutics", "Pharmacology", "Pharmaceutical Chemistry", "Pharmacognosy", "Clinical Pharmacy", "Pharmacy Practice"];
    }
    return ["All", "CSE", "CS", "IT", "ECE", "EE", "ME", "CE", "Civil", "Mechanical", "Electrical", "Electronics"];
  };

  const handleCourseChange = (value) => {
    const newBranches = getBranches(value);
    setLocalFilters({ 
      ...localFilters, 
      course: value, 
      branch: newBranches.includes(localFilters.branch) ? localFilters.branch : "All" 
    });
  };

  const handleChange = (field, value) => {
    if (field === "course") {
      handleCourseChange(value);
    } else {
      setLocalFilters({ ...localFilters, [field]: value });
    }
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = { course: "All", branch: "All", semester: "All", search: "" };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  const branches = getBranches(localFilters.course);
  const semesters = ["All", 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Filter Books</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Course Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <GraduationCap size={18} /> Course
            </label>
            <select
              value={localFilters.course}
              onChange={(e) => handleChange("course", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              {courses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Layers size={18} /> Branch
            </label>
            <select
              value={localFilters.branch}
              onChange={(e) => handleChange("branch", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar size={18} /> Semester / Year
            </label>
            <select
              value={localFilters.semester}
              onChange={(e) => handleChange("semester", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
            >
              {semesters.map(s => <option key={s} value={s}>{s === "All" ? "All Semesters" : `Semester ${s}`}</option>)}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Reset All
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}