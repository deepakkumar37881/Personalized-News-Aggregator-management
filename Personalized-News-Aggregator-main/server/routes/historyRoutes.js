const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const NewsHistory = require("../models/newsHistoryModel");
const axios = require("axios");

router.post("/save-news", async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log(user_id)
    let { articles, sources } = req.body;

    // Validate user_id and ensure at least one data type is present
    if (!user_id || (!articles && !sources)) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Ensure articles and sources are arrays, defaulting to empty array
    articles = Array.isArray(articles) ? articles : [];
    sources = Array.isArray(sources) ? sources : [];

    // Validate user_id format
    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user_id format." });
    }

    // Check if user already has a document
    let existingUser = await NewsHistory.findOne({ user_id });

    if (existingUser) {
      // Convert existing article IDs to a Set for efficient lookup
      const existingArticleIds = new Set(
        (existingUser.articles || []).map((a) => a.article_id)
      );

      // Convert existing source IDs to a Set for efficient lookup
      const existingSourceIds = new Set(
        (existingUser.sources || []).map((source) => source.id)
      );

      // Filter out duplicate articles
      const uniqueArticles = articles.filter(
        (article) => article && !existingArticleIds.has(article.article_id)
      );

      // Filter out duplicate sources
      const uniqueSources = sources.filter(
        (source) => source && !existingSourceIds.has(source.id)
      );

      // Append unique articles and sources
      if (uniqueArticles.length > 0) {
        existingUser.articles = existingUser.articles || [];
        existingUser.articles.push(...uniqueArticles);
      }

      if (uniqueSources.length > 0) {
        existingUser.sources = existingUser.sources || [];
        existingUser.sources.push(...uniqueSources);
      }
      console.log(existingUser.sources)

      await existingUser.save();
      return res
        .status(200)
        .json({ message: "News history updated!", data: existingUser });
    } else {
      // Create a new document if user doesn't exist
      const newHistory = new NewsHistory({
        user_id,
        articles: Array.from(new Map(
          articles
            .filter(article => article)
            .map((article) => [article.article_id, article])
        ).values()),
        sources: Array.from(new Map(
          sources
            .filter(source => source)
            .map((source) => [source.id, source])
        ).values()),
      });

      await newHistory.save();
      return res
        .status(201)
        .json({ message: "News history created!", data: newHistory });
    }
  } catch (error) {
    console.error("Error saving news history:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});
router.get("/fetch-history", async (req, res) => {
  try {
    const user_id = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Invalid user_id format." });
    }

    const userHistory = await NewsHistory.findOne({ user_id });

    if (!userHistory) {
      return res
        .status(404)
        .json({ message: "No history found for this user." });
    }

    return res
      .status(200)
      .json({ message: "User history retrieved!", data: userHistory });
  } catch (error) {
    console.error("Error fetching user history:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/recommendations/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Fetch user's history
    const userHistory = await NewsHistory.findOne({ user_id });

    // Fetch sources and news from NewsData.io
    const API_KEY = process.env.API_KEY;

    // Fetch sources
    const sourcesUrl = `https://newsdata.io/api/1/sources?apikey=${API_KEY}&language=en&country=in`;
    const sourcesResponse = await axios.get(sourcesUrl);
    const allSources = sourcesResponse.data.results || [];

    // Fetch latest news
    const newsUrl = `https://newsdata.io/api/1/latest?apikey=${API_KEY}&language=en&country=in`;
    const newsResponse = await axios.get(newsUrl);
    const latestArticles = newsResponse.data.results || [];

    // Prepare recommended sources (top 6 sources)
    const recommendedSources = allSources
      .filter((source) => source.url && source.description)
      .slice(0, 6)
      .map((source) => ({
        id: source.id,
        name: source.name,
        description: source.description,
        url: source.url,
        icon: source.icon,
        category: source.category || [],
        language: source.language,
        country: source.country,
      }));

    // Prepare suggested publishers (based on sources)
    const suggestedPublishers = recommendedSources.map((source) => ({
      id: source.id,
      name: source.name,
      description: source.description,
      url: source.url,
      icon: source.icon,
      category: source.category || [],
      language: source.language,
      country: source.country,
    }));

    // If no user history, return general recommendations
    if (
      !userHistory ||
      (userHistory.articles.length === 0 && userHistory.sources.length === 0)
    ) {
      return res.status(200).json({
        message: "Recommendations fetched successfully",
        recommendedSources: recommendedSources,
        suggestedPublishers: suggestedPublishers,
        recommendedArticles: latestArticles.slice(0, 10).map((article) => ({
          id: article.article_id,
          title: article.title,
          description: article.description,
          source: article.source_id,
          keywords: article.keywords,
          source_name: article.source_name,
          source_url: article.source_url,
          source_icon: article.source_icon,
          country: article.country,
          category: article.category,
          link: article.link,
          image_url: article.image_url,
          pubDate: article.pubDate,
        })),
      });
    }

    // Extract unique interests if user history exists
    const keywords = new Set();
    const categories = new Set();
    const sourceIds = new Set();

    userHistory.articles.forEach((article) => {
      article.keywords?.forEach((keyword) => keywords.add(keyword));
      article.category?.forEach((cat) => categories.add(cat));
      if (article.source_id) sourceIds.add(article.source_id);
    });

    // Filter relevant articles based on user interests
    const recommendedArticles = latestArticles
      .filter(
        (article) =>
          article.keywords?.some((keyword) => keywords.has(keyword)) ||
          article.category?.some((cat) => categories.has(cat)) ||
          (article.source_id && sourceIds.has(article.source_id))
      )
      .slice(0, 10)
      .map((article) => ({
        id: article.article_id,
        title: article.title,
        description: article.description,
        source: article.source_id,
        link: article.link,
        image_url: article.image_url,
        pubDate: article.pubDate,
      }));

    // Merge and prioritize recommendations
    const finalRecommendations = [
      ...recommendedArticles,
      ...latestArticles
        .slice(0, 10 - recommendedArticles.length)
        .map((article) => ({
          id: article.article_id,
          title: article.title,
          description: article.description,
          source: article.source_id,
          link: article.link,
          image_url: article.image_url,
          pubDate: article.pubDate,
        })),
    ];

    res.status(200).json({
      message: "Recommendations fetched successfully",
      recommendedSources: recommendedSources,
      suggestedPublishers: suggestedPublishers,
      recommendedArticles: finalRecommendations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
