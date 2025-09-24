const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  article_id: String, // Ensure this is stored as a String, not ObjectId
  title: String,
  link: String,
  keywords: [String],
  creator: [String],
  video_url: String,
  description: String,
  content: String,
  pubDate: String,
  pubDateTZ: String,
  image_url: String,
  source_id: String,
  source_priority: Number,
  source_name: String,
  source_url: String,
  source_icon: String,
  language: String,
  country: [String],
  category: [String],
  ai_tag: String,
  sentiment: String,
  sentiment_stats: String,
  ai_region: String,
  ai_org: String,
  duplicate: Boolean
});

const SourceSchema = new mongoose.Schema({
  id: String, // Ensure this is stored as a String, not ObjectId
  name: String,
  url: String,
  icon: String,
  priority: Number,
  description: String,
  category: [String],
  language: [String],
  country: [String],
  total_article: Number,
  last_fetch: String
});

const NewsHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  articles: [ArticleSchema], // Change from ObjectId to Schema
  sources: [SourceSchema] // Change from ObjectId to Schema
});

module.exports = mongoose.model('NewsHistory', NewsHistorySchema);
