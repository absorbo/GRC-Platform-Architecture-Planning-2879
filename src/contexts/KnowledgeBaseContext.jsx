```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNIS2 } from './NIS2Context';

const KnowledgeBaseContext = createContext();

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within KnowledgeBaseProvider');
  }
  return context;
};

export const KnowledgeBaseProvider = ({ children }) => {
  const { NIS2_CONTROLS } = useNIS2();
  
  const [articles, setArticles] = useState({});
  const [guides, setGuides] = useState({});
  const [regulations, setRegulations] = useState({});
  const [templates, setTemplates] = useState({});

  // Load knowledge base data
  useEffect(() => {
    const loadKnowledgeBaseData = () => {
      const storedData = localStorage.getItem('knowledge_base_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        setArticles(data.articles || {});
        setGuides(data.guides || {});
        setRegulations(data.regulations || {});
        setTemplates(data.templates || {});
      }
    };
    loadKnowledgeBaseData();
  }, []);

  // Save knowledge base data
  const saveKnowledgeBaseData = () => {
    const data = {
      articles,
      guides,
      regulations,
      templates
    };
    localStorage.setItem('knowledge_base_data', JSON.stringify(data));
  };

  // Article management
  const addArticle = (article) => {
    const articleId = `article_${Date.now()}`;
    setArticles(prev => ({
      ...prev,
      [articleId]: {
        ...article,
        id: articleId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    saveKnowledgeBaseData();
    return articleId;
  };

  // Guide management
  const addGuide = (guide) => {
    const guideId = `guide_${Date.now()}`;
    setGuides(prev => ({
      ...prev,
      [guideId]: {
        ...guide,
        id: guideId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    saveKnowledgeBaseData();
    return guideId;
  };

  // Regulation management
  const addRegulation = (regulation) => {
    const regulationId = `regulation_${Date.now()}`;
    setRegulations(prev => ({
      ...prev,
      [regulationId]: {
        ...regulation,
        id: regulationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    saveKnowledgeBaseData();
    return regulationId;
  };

  // Template management
  const addTemplate = (template) => {
    const templateId = `template_${Date.now()}`;
    setTemplates(prev => ({
      ...prev,
      [templateId]: {
        ...template,
        id: templateId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }));
    saveKnowledgeBaseData();
    return templateId;
  };

  // Search functionality
  const searchKnowledgeBase = (query, filters = {}) => {
    const normalizedQuery = query.toLowerCase();
    
    const results = {
      articles: Object.values(articles).filter(article =>
        matchesSearch(article, normalizedQuery, filters)
      ),
      guides: Object.values(guides).filter(guide =>
        matchesSearch(guide, normalizedQuery, filters)
      ),
      regulations: Object.values(regulations).filter(regulation =>
        matchesSearch(regulation, normalizedQuery, filters)
      ),
      templates: Object.values(templates).filter(template =>
        matchesSearch(template, normalizedQuery, filters)
      )
    };

    return results;
  };

  // Helper function for search matching
  const matchesSearch = (item, query, filters) => {
    const matchesQuery = 
      item.title?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query);

    if (!matchesQuery) return false;

    // Apply filters
    if (filters.type && item.type !== filters.type) return false;
    if (filters.industry && !item.industries?.includes(filters.industry)) return false;
    if (filters.controlId && item.controlId !== filters.controlId) return false;

    return true;
  };

  // Get related content
  const getRelatedContent = (itemId, itemType) => {
    const item = {
      article: articles[itemId],
      guide: guides[itemId],
      regulation: regulations[itemId],
      template: templates[itemId]
    }[itemType];

    if (!item) return null;

    const relatedContent = {
      articles: Object.values(articles).filter(article =>
        article.id !== itemId &&
        (
          article.controlId === item.controlId ||
          article.topics?.some(t => item.topics?.includes(t))
        )
      ),
      guides: Object.values(guides).filter(guide =>
        guide.id !== itemId &&
        (
          guide.controlId === item.controlId ||
          guide.industries?.some(i => item.industries?.includes(i))
        )
      ),
      templates: Object.values(templates).filter(template =>
        template.id !== itemId &&
        template.controlId === item.controlId
      )
    };

    return relatedContent;
  };

  const value = {
    // Content Management
    addArticle,
    addGuide,
    addRegulation,
    addTemplate,
    
    // Content Access
    getArticle: (id) => articles[id],
    getGuide: (id) => guides[id],
    getRegulation: (id) => regulations[id],
    getTemplate: (id) => templates[id],
    
    // Search and Relations
    searchKnowledgeBase,
    getRelatedContent,
    
    // Raw Data Access
    articles,
    guides,
    regulations,
    templates
  };

  return (
    <KnowledgeBaseContext.Provider value={value}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
};
```