const express = require('express');
const post = require("./postDb")
const router = express.Router();

router.get('/',async (req,res)=>{
  try{
      const posts= await post.get(req.query);
      res.status(200).json(posts)
  } catch(error) {
      console.log(error)
      res.status(500).json({errorMessage:"error"})
  }
})
router.get('/:id', validatePostId,(req,res)=>{

  post.getById(req.params.id)
    .then(data => res.json(data))
    .catch(error =>
      res.status(404).json({ message: "Could not retried post with this ID" })
    );
})
router.delete('/:id',validatePostId, (req, res) => {
  // do your magic!
  post.remove(req.params.id)
  .then( 
     post => {
 if (!post){
     res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
 } else{
   res.status(200).json(post);  
 }
})
.catch(error => {
 res.status(500).json({errorMessage: "The post could not be removed"});
});  
});

router.put('/:id', validatePostId,(req, res) => {
  // do your magic!
  const {id}= req.params;
  const userBody= req.body;
  post.update(id,userBody)
  .then(user => {
      if (!user){
          res.status(404).json({errorMessage:"The post with the specified ID does not exist."})
      } else if (!userBody.text){
          res.status(400).json({errorMessage:"Please provide text" })
      } else {
         res.status(200).json(user); 
      }
  })
  .catch(error => {
      res.status(500).json({errorMessage:"The post information could not be modified."});
  });
});

// custom middleware

function validatePostId (req, res, next) {
  // do your magic!
  post.getById(req.params.id)
  .then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(400).json({ message: "Post with this ID does not exist" });
    }
  })
  .catch(err =>
    res.status(500).json({ message: "There was an error retrieving this post" })
  );
};



module.exports = router;
