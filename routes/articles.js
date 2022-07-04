const express = require('express')
const Article = require('../models/article')
const router = express.Router()
const { checkAuthenticated } = require('../helpers/auth')
const Users = require('../models/Users')

router.get('/', checkAuthenticated, async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  const role = req.user.role
  if (role === 'admin') {
    return res.render('articles/adminindex', { articles: articles })
  }
  res.render('articles/index', { articles: articles })
})

router.get('/new', checkAuthenticated, (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', checkAuthenticated, async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', checkAuthenticated, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) return res.redirect('/')
  const role = req.user.role
  res.render('articles/show', { article: article, role })
})

// router.get('/myarticle', (req, res) => {
//   // const articleArr = req.user.articleId
//   // console.log(articleArr)
//   // const articles = [];
//   // for (let i = 0; i < articleArr.length; i++) {
//   //   const singleArticle = await Article.findById(articleArr[i]);
//   //   if (singleArticle) articles.push(singleArticle);
//   // }
//   // res.render('articles/myarticle', { articles: articles })
  
//     res.send("success");
// })

router.post('/', checkAuthenticated, async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', checkAuthenticated, async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', checkAuthenticated, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router