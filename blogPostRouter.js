const express = require('express'); 
const router = express.Router(); 

const bodyParser = require('body-parser'); 
const jsonParser = bodyParser.json(); 

const {BlogPosts} = require('./models'); 


BlogPosts.create('I Sure Hope This Works', 'I really am just hoping that this backend service works', 'Tony Douglas');
BlogPosts.create('Title #2', 'My brain hurts a little to make up good content right now', 'Unknown'); 
BlogPosts.create('Title #3', 'Same bro - ditto on the hurting brain', 'Hurt Brain'); 


router.get('/', (req, res) => {
	res.json(BlogPosts.get()); 
}); 

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post item \`${req.params.ID}\``);
  res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content, 
    author: req.body.author
  });
  res.status(204).end();
})

module.exports = router;

// GET and POST requests should go to /blog-posts.
// DELETE and PUT requests should go to /blog-posts/:id.
// Use Express router and modularize routes to /blog-posts.
// Add a couple of blog posts on server load so you'll automatically have some data to look at when the server starts.