const express = require('express');
const user = require("./userDb")
const post = require("../posts/postDb")
const router = express.Router();

router.post('/', validateUser,(req, res) => {
  // do your magic!
  const userBody = req.body;
    if(!userBody.name){
        res.status(400).json({errorMessage: "Please provide a name for the user."})
    } else {
        user.insert(userBody)
        .then(user =>{
            res.status(201).json(user)
        })
        .catch(err=>{
            res.status(500).json({errorMessage: "There was an error while saving the user"})
        })

    }
});

router.post('/:id/posts', validatePost, (req, res) => {
  // do your magic!
  const id = req.params.id;
  const data = req.body;
  post.insert({...data, user_id: id})
    .then(data => {
      res.status(201).json({data})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({errorMessage: "Could not post."})
    })
});

router.get('/', async (req, res) => {
  // do your magic!
  try{
    const users= await user.get(req.query);
    res.status(200).json(users)
} catch(error) {
    console.log(error)
    res.status(500).json({errorMessage:"error"})
}
});

router.get('/:id',validateUserId ,(req, res) => {
  // do your magic!
  user.getById(req.params.id)
  .then(data => res.json(data))
  .catch(error =>
    res.status(404).json({ message: "Could not retried user with this ID" })
  );
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
  user.getUserPosts(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({errorMessage: "User does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({errorMessage: "Error connecting" });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  user.remove(req.params.id)
  .then( 
     user => {
 if (!user){
     res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
 } else{
   res.status(200).json(user);  
 }
})
.catch(error => {
 res.status(500).json({errorMessage: "The user could not be removed"});
  });  
});

router.put('/:id', validateUser, (req, res) => {
  // do your magic!
  const {id}= req.params;
  const userBody= req.body;
  user.update(id,userBody)
  .then(user => {
      if (!user){
          res.status(404).json({errorMessage:"The user with the specified ID does not exist."})
      } else if (!userBody.name){
          res.status(400).json({errorMessage:"Please provide text" })
      } else {
         res.status(200).json(user); 
      }
  })
  .catch(error => {
      res.status(500).json({errorMessage:"The user information could not be modified."});
  });
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  user.getById(req.params.id)
  .then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(400).json({ message: "User with this ID does not exist" });
    }
  })
  .catch(err =>
    res.status(500).json({ message: "There was an error retrieving this user" })
  );
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    return res.status(400).json({ errorMessage: "missing user data"} );
  } else if (!req.body.name) {
    return res.status(400).json({ errorMessage: "missing required text field" });
  } else {
    next();
  };
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    return res.status(400).json({ errorMessage: "missing post data"} );
  } else if (!req.body.text) {
    return res.status(400).json({ errorMessage: "missing required text field" });
  } else {
    next();
  };
}

module.exports = router;
