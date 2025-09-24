import React, { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import Card from "../components/Cards";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

const SavedNews = () => {
  const [visitedNews, setVisitedNews] = useState([]);
  const [visitedSources, setVisitedSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const result = await axios.get(`${API_URL}/history/fetch-history`, { headers });

      setVisitedNews(result.data.data.articles || []);
      setVisitedSources(result.data.data.sources || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 bg-gradient-to-br from-white to-gray-100 p-8">
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-12">
            {/* Visited News Section */}
            <section>
              <h2 className="text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-400 pb-3">
                Saved News
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p className="text-center text-lg">Loading saved news...</p>
                ) : error ? (
                  <div className="text-red-700 bg-red-100 p-4 rounded-lg text-center">Error: {error}</div>
                ) : visitedNews.length > 0 ? (
                  visitedNews.map((article, index) => <NewsCard key={index} article={article} />)
                ) : (
                  <p className="text-center text-lg text-gray-500">No saved news available.</p>
                )}
              </div>
            </section>

            {/* Visited Sources Section */}
            <section>
              <h2 className="text-4xl font-bold text-blue-600 mb-6 border-b-2 border-blue-400 pb-3">
                Saved Sources
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <p className="text-center text-lg">Loading sources...</p>
                ) : error ? (
                  <div className="text-red-700 bg-red-100 p-4 rounded-lg text-center">Error: {error}</div>
                ) : visitedSources.length > 0 ? (
                  visitedSources.map((source, index) => <Card key={index} article={source} />)
                ) : (
                  <p className="text-center text-lg text-gray-500">No saved sources available.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SavedNews;