const express = require('express')
const Article = require('../models/article')
const router = express.Router()
const { checkAuthenticated } = require('../helpers/auth')
const Users = require('../models/Users')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/jpg']

//main article page
router.get('/', checkAuthenticated, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/demoIndex', { articles: articles, user: req.user })
})
//for profile page
router.get('/profile', checkAuthenticated, (req, res) => {
  res.render("articles/profile", { user: req.user });
});
// users can visit every other user's profile page
router.get('/profile/:id', checkAuthenticated, async (req, res) => {
  //if I'm visiting my profile via my articles (Edgecase)
  if (req.params.id == req.user._id) {
    return res.redirect('/articles/profile')
  }
  const user = await Users.findById(req.params.id)
  res.render("articles/profile", { user: user });
});
//new article
router.get('/new', checkAuthenticated, (req, res) => {
  res.render('articles/new', { article: new Article() })
})
//get edit form with specific id
router.get('/edit/:id', checkAuthenticated, async (req, res) => {
  const article = await Article.findById(req.params.id)
  //article edit and delete only for owner and delete for admin
  const articleOwnerId = article.ownerId;
  if (article.ownerId == req.user._id) {
    return res.render('articles/edit', { article: article })
  }
  res.send('You are not the owner of this article neither an admin')
})
//get specific article
router.get('/:slug', checkAuthenticated, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) return res.redirect('/')
  const role = req.user.role
  res.render('articles/demoView', { article: article, role })
})
//create new article
router.post('/', checkAuthenticated, async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))
//edit article
router.put('/:id', checkAuthenticated, async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))
//delete article
router.get('/delete/:id', checkAuthenticated, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})
//save article and redirect
function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    article.ownerId = req.user._id
    article.ownerName = req.user.name
    saveCover(article, req.body.cover)
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

function saveCover(article, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    article.coverImage = new Buffer.from(cover.data, 'base64')
    article.coverImageType = cover.type
  }
}

module.exports = router