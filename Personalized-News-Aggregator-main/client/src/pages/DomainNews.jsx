import React, { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

const DomainNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [noArticlesReason, setNoArticlesReason] = useState("");

  const location = useLocation();
  const domain = location.state?.domain;
  const name = location.state?.name;

  useEffect(() => {
    fetchNews();
  }, [dateFilter, page, domain]);

  const fetchNews = async () => {
    setLoading(true);
    setNoArticlesReason(""); // Reset the reason
    const token = localStorage.getItem("token");

    try {
      const params = {};
      if (dateFilter) params.date = dateFilter;
      params.page = page;

      const response = await axios.get(`${API_URL}/news/${domain}`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      const results = response.data?.results || [];
      
      if (page === 1) {
        setArticles(results);
      } else {
        setArticles(prevArticles => [...prevArticles, ...results]);
      }
      
      if (results.length === 0 && page === 1) {
        if (dateFilter) {
          setNoArticlesReason(`No articles available for the selected time period.`);
        } else {
          setNoArticlesReason(`No articles available for this source.`);
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching news");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setPage(1); // Reset to first page when changing date filter
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNoArticlesReason(""); // Reset the reason
    setPage(1); // Reset to first page when searching

    const term = searchTerm.trim().toLowerCase();
    const token = localStorage.getItem("token");

    try {
      if (!term) {
        await fetchNews();
      } else {
        const params = { 
          searchWord: term,
          domain: domain
        };
        
        if (dateFilter) params.date = dateFilter;

        const response = await axios.get(
          `${API_URL}/news/search`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params
          }
        );
        
        const results = response.data.results || [];
        setArticles(results);
        
        if (results.length === 0) {
          setNoArticlesReason(`No search results found for "${term}".`);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setError(error.message || "An error occurred while searching");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg font-semibold animate-pulse">
          Loading news articles...
        </p>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-10 text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Search & Filters */}
          <div className="flex flex-col w-full md:flex-row items-end gap-2 mb-6">
            <form onSubmit={handleSearch} className="relative w-full md:w-2/3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full bg-white border border-gray-300 py-3 px-5 pl-12 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Search news..."
              />
              <button 
                type="submit" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition"
              >
                Search
              </button>
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                🔍
              </span>
            </form>
            
            {/* Date Filter */}
            <div className="flex ml-40 flex-end gap-6">
              <select
                id="date-filter"
                value={dateFilter}
                onChange={handleDateChange}
                className="bg-white text-gray-700 p-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* News Section */}
          <h2 className="text-gray-800 text-3xl mt-6 mb-8 font-bold tracking-tight text-center">
            Latest News by {name || domain}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 justify-items-center">
            {articles?.length > 0 ? (
              articles.map((article, index) => (
                <NewsCard key={`${article.id || index}`} article={article} />
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                {noArticlesReason}
              </p>
            )}
          </div>
          
          {/* Load More Button */}
          {articles.length > 0 && !loading && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-md"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
          
          {/* Loading indicator for pagination */}
          {loading && page > 1 && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 animate-pulse">Loading more articles...</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DomainNews;