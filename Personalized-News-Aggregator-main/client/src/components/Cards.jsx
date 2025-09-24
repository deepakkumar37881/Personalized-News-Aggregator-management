import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bookmark, BookmarkCheck } from "lucide-react"; // Importing icons

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

const Card = ({ article }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = (article) => {
    navigate("/domain-news", {
      state: { domain: article.id, name: article.name },
    });
  };

  const handleSave = async (e) => {
    e.stopPropagation(); // Prevent navigation when clicking Save
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to save articles.");
        setSaving(false);
        return;
      }

      const response = await axios.post(
        `${API_URL}/history/save-news`,
        { sources: [article] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data)
      alert("Source saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="bg-white text-gray-800 p-6 rounded-2xl shadow-md w-full max-w-[360px] min-h-[340px] cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border border-gray-200 relative"
      onClick={() => handleClick(article)}
    >
      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          saving
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 cursor-pointer"
        }`}
      >
        {saving ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        {saving ? "Saving..." : "Save"}
      </button>

      {article && (
        <>
          <img
            src={article.icon}
            alt={article.name}
            className="w-full h-48 object-cover rounded-xl mb-4"
          />
          <h2 className="text-xl font-semibold text-gray-800 truncate">{article.name}</h2>
          <p className="text-gray-600 text-sm mt-3 line-clamp-3">
            {article.description || "No description available."}
          </p>
        </>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
};

export default Card;
