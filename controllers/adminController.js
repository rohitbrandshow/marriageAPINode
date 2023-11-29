const axios = require('axios');
const Notification = require('../model/admin').Notification;
const Article = require('../model/admin').Article;
const User = require('../model/user');
const { userLogUrl } = require('../config');

// Controller for creating notifications
const createNotification = async (req, res) => {
  const { title, description, dateTime, addedBy, status, featuredStatus } = req.body;

  try {
    // Validate the incoming data
    if (!title || !description || !addedBy || !dateTime) {
      return res.status(400).json({ success: false, status: 'false', message: 'Title, description, Date and Time, and addedBy are required fields' });
    }

    // Check if the addedBy user exists in your database and is an admin
    const query = { _id: addedBy, userType: 'Admin' };
    const userAdmin = await User.findOne(query);

    if (!userAdmin) {
      return res.status(403).json({
        success: false,
        status: 'false',
        message: 'You are not an Admin. You cannot add new notifications.',
      });
    }

    // Check if a notification with the same title already exists
    const existingNotification = await Notification.findOne({ title });

    if (existingNotification) {
      return res.status(400).json({
        success: false,
        status: 'false',
        message: 'A notification with the same title already exists.',
      });
    }

    // If status is not provided, set it to 'active'
    const notificationStatus = status || 'active';
    const statusFeatured = featuredStatus || false;

    // Create a new notification
    const notification = new Notification({
      title,
      description,
      dateAndTime: dateTime,
      addedBy,
      addedOn: new Date(),
      status: notificationStatus,
      featuredStatus: statusFeatured
    });

    await notification.save();

    // Log the action
    const userLogData = {
      userId: addedBy,
      action: 'Inserted',
      createdBy: addedBy, // Replace with the actual creator ID
      changeType: 'Insert',
      changes: 'Admin inserted a notification.',
    };

    // Send a POST request to the user-log API
    await axios.post(userLogUrl, userLogData);

    return res.json({ success: true, status: 'true', message: 'New Notification Added Successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, status: 'false', message: error.message });
  }
};



  const editNotification = async (req, res) => {
    const { id, title, description, dateTime, addedBy, status, featuredStatus } = req.body;

    try {
      // Validate the incoming data
      if (!id || !title || !description || !addedBy || !dateTime) {
        return res.status(400).json({ success: false, status: 'false', message: 'ID, title, description, Date and Time, and addedBy are required fields' });
      }

      // Check if the addedBy user exists in your database and is an admin
      const query = { _id: addedBy, userType: 'Admin' };
      const userAdmin = await User.findOne(query);

      if (!userAdmin) {
        return res.status(403).json({
          success: false,
          status: 'false',
          message: 'You are not an Admin. You cannot edit notifications.',
        });
      }

      // Find the notification by ID
      const existingNotification = await Notification.findById(id);

      if (!existingNotification) {
        return res.status(404).json({
          success: false,
          status: 'false',
          message: 'Notification not found.',
        });
      }

      // Check if a notification with the same title already exists (excluding the current one)
      const otherNotificationWithSameTitle = await Notification.findOne({ title, _id: { $ne: id } });

      if (otherNotificationWithSameTitle) {
        return res.status(400).json({
          success: false,
          status: 'false',
          message: 'A notification with the same title already exists.',
        });
      }

      // Update the notification fields
      existingNotification.title = title;
      existingNotification.description = description;
      existingNotification.dateAndTime = dateTime;
      existingNotification.updatedBy = addedBy; // Assuming you want to track the user who edited the notification
      existingNotification.updatedOn = new Date();
      existingNotification.status = status || existingNotification.status; // Use the provided status or keep the existing one
      existingNotification.featuredStatus = featuredStatus || existingNotification.featuredStatus; // Use the provided status or keep the existing one

      await existingNotification.save();

      // Log the action
      const userLogData = {
        userId: addedBy,
        action: 'Updated',
        createdBy: addedBy, // Replace with the actual creator ID
        changeType: 'Update',
        changes: 'Admin updated a notification.',
      };

      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);

      return res.json({ success: true, status: 'true', message: 'Notification Updated Successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, status: 'false', message: error.message });
    }
  };


  const createArticle = async (req, res) => {
    const { title, shortDescription, description, metaTitle, metaDescription, metaKeywords, addedBy, status, featuredStatus } = req.body;
  
    try {
      // Validate the incoming data
      if (!title || !shortDescription || !description || !metaTitle || !metaDescription || !metaKeywords || !addedBy || !status) {
        return res.status(400).json({ success: false, status: 'false', message: 'All fields are required for creating an article' });
      }
  
      // Check if the user adding the article exists in your database and is an admin
      const query = { _id: addedBy, userType: 'Admin' };
      const userAdmin = await User.findOne(query);
  
      if (!userAdmin) {
        return res.status(403).json({
          success: false,
          status: 'false',
          message: 'You are not an Admin. You cannot add new articles.',
        });
      }
  
      // Create URL from the title
      const url = title
        .trim() // Remove spaces at the beginning and end
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .toLowerCase(); // Convert to lowercase
  
      // Check if the article with the generated URL already exists
      const existingArticle = await Article.findOne({ url: url });
  
      if (existingArticle) {
        return res.status(400).json({
          success: false,
          status: 'false',
          message: 'Article with the provided title already exists.',
        });
      }

      const statusFeatured = featuredStatus || false;
  
      // Create a new article
      const article = new Article({
        title: title,
        shortDescription: shortDescription,
        description: description,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
        metaKeywords: metaKeywords,
        addedBy: addedBy,
        addedOn: new Date(),
        status: status,
        url: url,
        featuredStatus: statusFeatured
      });
  
      await article.save();
  
      // Log the action
      const userLogData = {
        userId: addedBy,
        action: 'Inserted',
        createdBy: addedBy,
        changeType: 'Insert',
        changes: 'Admin inserted an article.',
      };
  
      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);
  
      return res.json({ success: true, status: 'true', message: 'New Article Added Successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, status: 'false', message: error.message });
    }
  };

  const editArticle = async (req, res) => {
    const { id, title, shortDescription, description, metaTitle, metaDescription, metaKeywords, addedBy, status, featuredStatus } = req.body;
  
    try {
      // Validate the incoming data
      if (!id || !title || !shortDescription || !description || !metaTitle || !metaDescription || !metaKeywords || !addedBy) {
        return res.status(400).json({ success: false, status: 'false', message: 'ID, title, shortDescription, description, metaTitle, metaDescription, metaKeywords, and addedBy are required fields' });
      }
  
      // Check if the addedBy user exists in your database and is an admin
      const query = { _id: addedBy, userType: 'Admin' };
      const userAdmin = await User.findOne(query);
  
      if (!userAdmin) {
        return res.status(403).json({
          success: false,
          status: 'false',
          message: 'You are not an Admin. You cannot edit articles.',
        });
      }
  
      // Find the article by ID
      const existingArticle = await Article.findById(id);
  
      if (!existingArticle) {
        return res.status(404).json({
          success: false,
          status: 'false',
          message: 'Article not found.',
        });
      }
  
      // Check if the updated title, meta title, keywords, and meta description already exist
      const titleExists = await Article.findOne({ title, _id: { $ne: id } });
      const metaTitleExists = await Article.findOne({ metaTitle, _id: { $ne: id } });
      const keywordsExist = await Article.findOne({ metaKeywords, _id: { $ne: id } });
      const metaDescExists = await Article.findOne({ metaDescription, _id: { $ne: id } });
  
      if (titleExists || metaTitleExists || keywordsExist || metaDescExists) {
        return res.status(400).json({
          success: false,
          status: 'false',
          message: 'Title, meta title, keywords, or meta description already exist. Please use unique values.',
        });
      }
  
      // Update the article fields
      existingArticle.title = title;
      existingArticle.shortDescription = shortDescription;
      existingArticle.description = description;
      existingArticle.metaTitle = metaTitle;
      existingArticle.metaDescription = metaDescription;
      existingArticle.metaKeywords = metaKeywords;
      existingArticle.updatedBy = addedBy;
      existingArticle.updatedOn = new Date();
      existingArticle.status = status || existingArticle.status;
      existingArticle.featuredStatus = featuredStatus || existingArticle.featuredStatus;
  
      await existingArticle.save();
  
      // Log the action
      const userLogData = {
        userId: addedBy,
        action: 'Updated',
        createdBy: addedBy,
        changeType: 'Update',
        changes: 'Admin updated an article.',
      };
  
      // Send a POST request to the user-log API
      await axios.post(userLogUrl, userLogData);
  
      return res.json({ success: true, status: 'true', message: 'Article Updated Successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, status: 'false', message: error.message });
    }
  }; 

  const getArticles = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Current page number
        const limit = parseInt(req.query.limit) || 10; // Number of articles per page
    
        // Calculate the starting index for pagination
        const startIndex = (page - 1) * limit;
    
        // Query to get articles with pagination
        const articles = await Article.find().skip(startIndex).limit(limit);
    
        // Total number of articles in the database
        const totalArticles = await Article.countDocuments();
    
        // Prepare response with pagination metadata
        const response = {
          success: true,
          status: 'true',
          message: 'Articles retrieved successfully',
          data: {
            articles: articles,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(totalArticles / limit),
              totalArticles: totalArticles,
            },
          },
        };
    
        res.json(response);
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, status: 'false', message: 'Error retrieving articles' });
      }
  }

  const getNotifications = async (req, res) => {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1; // Current page number
      const limit = parseInt(req.query.limit) || 10; // Number of notifications per page
  
      // Calculate the starting index for pagination
      const startIndex = (page - 1) * limit;
  
      // Query to get notifications with pagination
      const notifications = await Notification.find().skip(startIndex).limit(limit);
  
      // Total number of notifications in the database
      const totalNotifications = await Notification.countDocuments();
  
      // Prepare response with pagination metadata
      const response = {
        success: true,
        status: 'true',
        message: 'Notifications retrieved successfully',
        data: {
          notifications: notifications,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalNotifications / limit),
            totalNotifications: totalNotifications,
          },
        },
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, status: 'false', message: 'Error retrieving notifications' });
    }
  }
  
  const getNotificationById = async (req, res) => {
    try {
      const id = req.query.id; // Use req.query.id to get the value of the id query parameter
  
      // Find the notification by ID
      if (!id) {
        return res.status(404).json({
          success: false,
          status: 'false',
          message: 'Notification ID is required.',
        });
      }
  
      const query = { _id: id };
      const notification = await Notification.findById(query);
  
      if (!notification) {
        return res.status(404).json({
          success: false,
          status: 'false',
          message: 'Notification not found.',
        });
      }
  
      // Prepare response
      const response = {
        success: true,
        status: 'true',
        message: 'Notification retrieved successfully',
        data: {
          notification: notification,
        },
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, status: 'false', message: 'Error retrieving notification' });
    }
  };  

  const getArticleById = async (req, res) => {
    try {
      const id = req.query.id; // Use req.query.id to get the value of the id query parameter
  
      // Find the article by ID
      if (!id) {
        return res.status(404).json({
          success: false,
          status: 'false',
          message: 'Article ID is required.',
        });
      }
  
      const query = { _id: id };
      const article = await Article.findById(query);
  
      if (!article) {
        return res.status(404).json({
          success: false,
          status: 'false',
          message: 'Article not found.',
        });
      }
  
      // Prepare response
      const response = {
        success: true,
        status: 'true',
        message: 'Article retrieved successfully',
        data: {
          article: article,
        },
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, status: 'false', message: 'Error retrieving article' });
    }
  };

  const getArticleByUrl = async (req, res) => {
    try {
      const url = req.query.url; // Use req.query.url to get the value of the url query parameter
  
      // Find the article by URL
      if (!url) {
        return res.status(404).json({
          success: false,
          status: 'false',
          message: 'Article URL is required.',
        });
      }
  
      const query = { url: url };
      const article = await Article.findOne(query);
  
      if (!article) {
        return res.status(404).json({
          success: false,
          status: 'false',
          message: 'Article not found.',
        });
      }
  
      // Prepare response
      const response = {
        success: true,
        status: 'true',
        message: 'Article retrieved successfully',
        data: {
          article: article,
        },
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, status: 'false', message: 'Error retrieving article' });
    }
  };
  
module.exports = {
  createNotification,
  editNotification,
  createArticle,
  editArticle,
  getArticles,
  getNotifications,
  getNotificationById,
  getArticleById,
  getArticleByUrl
};
