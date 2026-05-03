import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddBookPopup } from "../store/slices/popupSlice";
import { addBook, getAllBooks } from "../store/slices/bookSlice";
import { toast } from "react-toastify";
import { X, Book, User, DollarSign, Hash, AlignLeft, GraduationCap, Layers, Calendar, Clock } from "lucide-react";

export default function AddBookPopup() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.book);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    quantity: "",
    course: "BTech",
    branch: "CSE",
    semester: "1",
    year: "",
    subject: ""
  });

  const courses = [
    "BTech", "MTech", "BCA", "MCA", "BSc", "MSc", 
    "BBA", "MBA", "PhD", "Diploma", "B.Pharma", "M.Pharma"
  ];

  const getBranchesByCourse = (course) => {
    if (course === "Diploma") {
      return ["Diploma CS", "Diploma IT", "Diploma EC", "Diploma EE", "Diploma ME"];
    }
    if (course === "B.Pharma" || course === "M.Pharma") {
      return ["Pharmaceutics", "Pharmacology", "Pharmaceutical Chemistry", "Pharmacognosy", "Clinical Pharmacy", "Pharmacy Practice"];
    }
    return ["CSE", "CS", "IT", "ECE", "EE", "ME", "CE", "Civil", "Mechanical", "Electrical", "Electronics"];
  };

  const getSemesters = (course) => {
    if (course === "Diploma") return 6;
    if (course === "B.Pharma") return 8;
    if (course === "M.Pharma") return 4;
    if (course === "BTech" || course === "BCA") return 8;
    if (course === "MTech" || course === "MCA") return 4;
    if (course === "BSc" || course === "BBA") return 6;
    if (course === "MSc" || course === "MBA") return 4;
    return 8;
  };

  const branches = getBranchesByCourse(formData.course);
  const maxSemester = getSemesters(formData.course);
  const semesters = Array.from({ length: maxSemester }, (_, i) => i + 1);
  const showYearField = formData.course === "Diploma" || formData.course === "B.Pharma" || formData.course === "M.Pharma";

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "course") {
      const newBranches = getBranchesByCourse(value);
      setFormData({ 
        ...formData, 
        course: value, 
        branch: newBranches[0] || "",
        semester: "1",
        year: ""
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    
    if (!formData.title.trim()) {
      toast.error("Please enter book title");
      return;
    }
    if (!formData.author.trim()) {
      toast.error("Please enter author name");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Please enter subject");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter description");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Please enter valid price");
      return;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      toast.error("Please enter valid quantity");
      return;
    }
    if (!formData.course) {
      toast.error("Please select course");
      return;
    }
    if (!formData.branch) {
      toast.error("Please select branch");
      return;
    }
    
    if (showYearField) {
      if (!formData.year) {
        toast.error("Please select year");
        return;
      }
    } else {
      if (!formData.semester) {
        toast.error("Please select semester");
        return;
      }
    }
    
    const bookData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      course: formData.course,
      branch: formData.branch,
      semester: showYearField ? null : Number(formData.semester),
      year: showYearField ? Number(formData.year) : null,
      subject: formData.subject.trim()
    };
    
    console.log("Sending book data:", bookData);
    
    try {
      const result = await dispatch(addBook(bookData));
      console.log("Add book result:", result);
      
      if (result && result.success === true) {
        toast.success("Book added successfully!");
        dispatch(toggleAddBookPopup());
        setFormData({
          title: "", author: "", description: "", price: "", quantity: "",
          course: "BTech", branch: "CSE", semester: "1", year: "", subject: ""
        });
        dispatch(getAllBooks());
      } else if (result?.message) {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Add book error:", error);
      toast.error("Failed to add book");
    }
  };

  const handleClose = () => {
    dispatch(toggleAddBookPopup());
    setFormData({
      title: "", author: "", description: "", price: "", quantity: "",
      course: "BTech", branch: "CSE", semester: "1", year: "", subject: ""
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Add New Book</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
              <div className="relative">
                <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange}
                  placeholder="Enter book title" 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange}
                  placeholder="Enter author name" 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black" 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Course, Branch, Semester/Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2  items-center gap-2">
                <GraduationCap size={18} /> Course *
              </label>
              <select 
                name="course" 
                value={formData.course} 
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              >
                {courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2  items-center gap-2">
                <Layers size={18} /> Branch *
              </label>
              <select 
                name="branch" 
                value={formData.branch} 
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
              >
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              {showYearField ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                    <Clock size={18} /> Year *
                  </label>
                  <select 
                    name="year" 
                    value={formData.year} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    {formData.course === "B.Pharma" && <option value="4">4th Year</option>}
                  </select>
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2  items-center gap-2">
                    <Calendar size={18} /> Semester *
                  </label>
                  <select 
                    name="semester" 
                    value={formData.semester} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                  >
                    {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <input 
              type="text" 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange}
              placeholder="e.g., Data Structures, Computer Networks, Pharmacology, etc."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black" 
              required 
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                rows="3" 
                placeholder="Enter book description"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black" 
                required 
              />
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange}
                  placeholder="Price" 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                  required 
                  min="0" 
                  step="1" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={handleChange}
                  placeholder="Quantity" 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                  required 
                  min="1" 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={handleClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}