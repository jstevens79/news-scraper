const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../models');
const cheerio = require('cheerio');

router.get('/', (req, res) => {
  db.Article.find({})
    .then(dbArticle => res.render('index', dbArticle))
    .catch(err => res.json(err))
  //res.render('index')
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

router.post('/articles', (req, res) => {
  db.Article.create(req.body)
    .then(dbArticle => {
      res.json(dbArticle)
    })
    .catch(err => {
      console.log(err)
    })
})

router.delete('/articles/:id', (req, res) => {
  db.Article.deleteOne({ '_id': req.params.id}, (err, complete) => res.send('complete'))
})

module.exports = router;