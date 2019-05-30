const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models');
const cheerio = require('cheerio');

router.get('/', (req, res) => {
  db.Article.find({})
    .limit(3)
    .then(dbArticle => {
      res.render('index', {articles: dbArticle})
    })
    .catch(err => res.json(err))
})

router.get('/articles', (req, res) => {
  db.Article.find({})
    .then(dbArticle => {
      res.render('articles', {articles: dbArticle})
    })
    .catch(err => res.json(err))
})

router.get('/scrape', (req,res) => {
  axios.get('https://www.macrumors.com/').then(response => {
    // res.send(response.data);
    const $ = cheerio.load(response.data);
    const results = []

    $(".article").each(function(i, elem) {
      const result = {}
      result.link = $(this).find('.title a').attr('href')
      result.title = $(this).find('.title a').text()
      result.byline = $(this).find('.byline').text()
      result.content = $(this).find('.content').text().trim()
      results.push(result)
    })

    res.json(results)

  })
})

router.get('/note/:id', (req, res) => {
  db.Note.findOne({ _id: req.params.id})
    .then(dbNote => res.json(dbNote))
    .catch(err => {
      console.log(err)
    })
})

router.post('/articles', (req, res) => {
  db.Article.create(req.body)
    .then(dbArticle => res.json(dbArticle))
    .catch(err => {
      console.log(err)
    })
})

router.post('/articles/:id/note', (req, res) => {
  db.Note.create(req.body)
    .then(dbNote => {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id}, { new: true})
    })
    .then(dbArticle => res.json(dbArticle))
    .catch(err => res.json(err))
})

router.delete('/note/:id', (req, res) => {
  db.Note.deleteOne({ '_id': req.params.id}, (err, complete) => res.send('complete'))
})

router.delete('/articles/:id', (req, res) => {
  db.Article.deleteOne({ '_id': req.params.id}, (err, complete) => res.send('complete'))
})

module.exports = router;