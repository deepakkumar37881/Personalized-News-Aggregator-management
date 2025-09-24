import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Importing axios for API calls
import { Bookmark, BookmarkCheck } from "lucide-react"; // Importing icons

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

function NewsCard({ article }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false); // State to handle saving status
  const [error, setError] = useState(null); // State to handle errors

  const handleClick = () => {
    if (article.link) {
      window.open(article.link, "_blank", "noopener,noreferrer"); // Open in new tab
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You need to be logged in to save articles.");
        setSaving(false);
        return;
      }

      // API call to save the article
      const response = await axios.post(
        `${API_URL}/history/save-news`,
        { articles: [article] }, // Sending the entire article object to the backend
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      // Optionally, you can show a success message or update UI to indicate the article is saved
      alert("Article saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save article.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-[360px] min-h-[460px] shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border border-gray-200 relative">
      {/* Save Button - Positioned at top-right */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
          saving
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 cursor-pointer"
        }`}
      >
        {saving ? (
          <BookmarkCheck className="w-4 h-4" />
        ) : (
          <Bookmark className="w-4 h-4" />
        )}
        {saving ? "Saving..." : "Save"}
      </button>

      <a href={article.link} target="_blank" rel="noopener noreferrer">
        <img
          className="w-full h-52 object-cover rounded-xl mb-4"
          src={article.image_url || article.source_icon} // Fallback to placeholder if no image
          alt={article.title || "News Image"}
        />
      </a>
      <div className="flex flex-col max-h-full">
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          <h5 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
            {article.title || "No title available"}
          </h5>
        </a>
        <p className="text-sm text-gray-600 mb-4 line-clamp-4">
          {article.description || "No description available"}
        </p>

        {/* Error message if saving fails */}
        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default NewsCard;
