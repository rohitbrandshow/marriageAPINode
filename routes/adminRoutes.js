const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/notification/add', adminController.createNotification);
router.post('/notification/edit', adminController.editNotification);
router.post('/article/add', adminController.createArticle);
router.post('/article/edit', adminController.editArticle);
router.get('/article/get', adminController.getArticles);
router.get('/notification/get', adminController.getNotifications);
router.get('/notification/getById', adminController.getNotificationById);
router.get('/article/getById', adminController.getArticleById);
router.get('/article/getByURL', adminController.getArticleByUrl);

module.exports = router;

