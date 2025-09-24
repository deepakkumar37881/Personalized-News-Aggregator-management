import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Cards";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

const Source = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState("en");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(12);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/news/sources/${language}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAllArticles(res.data);
        setFilteredArticles(res.data);
        setCurrentPage(1);
      } catch (err) {
        setError(err.message || "Something went wrong while fetching news sources.");
      } finally {
        setLoading(false);
      }
    };
    fetchSources();
  }, [language]);

  // Client-side filtering function
  const filterArticles = () => {
    let results = [...allArticles];
    
    if (searchTerm.trim()) {
      const terms = searchTerm.trim().toLowerCase().split(/\s+/);
      
      results = results.filter(article => 
        terms.every(term => 
          (article.title && article.title.toLowerCase().includes(term)) ||
          (article.description && article.description.toLowerCase().includes(term)) ||
          (article.source_id && article.source_id.toLowerCase().includes(term)) ||
          (article.source_name && article.source_name.toLowerCase().includes(term))
        )
      );
    }
    
    return results;
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const results = filterArticles();
    setFilteredArticles(results);
    setCurrentPage(1);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Get current articles for pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  
  // Create page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 border-b-2 border-blue-500 pb-3">
            News Sources
          </h2>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
            <form onSubmit={handleSearch} className="relative w-full md:w-2/3">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-full bg-white border border-gray-300 py-3 px-5 pl-12 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Search within sources..."
              />
              <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition">
                Search
              </button>
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                🔍
              </span>
            </form>
            
            {/* Language Filter */}
            <div className="flex gap-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white w-40 border border-gray-300 p-2 rounded-md shadow-sm focus:ring-blue-500 focus:outline-none transition"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
                <option value="ta">Tamil</option>
              </select>
            </div>
          </div>

          {/* News Sources */}
          {loading ? (
            <p className="text-center text-lg">Loading news sources...</p>
          ) : error ? (
            <p className="text-center text-red-500 bg-red-100 p-3 rounded-lg">Error: {error}</p>
          ) : filteredArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentArticles.map((article) => (
                  <Card key={article.id} article={article} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {filteredArticles.length > articlesPerPage && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`mx-1 px-3 py-2 rounded-md transition-colors ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    
                    {pageNumbers.map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`mx-1 px-4 py-2 rounded-md transition-colors cursor-pointer ${
                          currentPage === number
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className={`mx-1 px-3 py-2 rounded-md transition-colors ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
              
              {/* Pagination info */}
              <div className="mt-4 text-center text-gray-600">
                <p>
                  Showing {filteredArticles.length === 0 ? 0 : indexOfFirstArticle + 1}-
                  {indexOfLastArticle > filteredArticles.length ? filteredArticles.length : indexOfLastArticle} of {filteredArticles.length} sources
                  {allArticles.length !== filteredArticles.length && ` (filtered from ${allArticles.length} total)`}
                </p>
              </div>
            </>
          ) : (
            <p className="text-center text-lg bg-white p-6 rounded-lg shadow-lg">
              {allArticles.length > 0 ? 
                "No sources match your search criteria." : 
                "No news sources available."
              }
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Source;