const express = require('express');
const Joi = require('joi');
const app = express();
const cors = require('cors');
const user = require('./repositories/user.js');
const followers = require('./repositories/followers.js');
const likes = require('./repositories/likes.js');
const post = require('./repositories/post.js');
const comments = require('./repositories/comments.js')
const jwt = require('jsonwebtoken');
require('dotenv').config()

app.use(cors())
app.use(express.json());

const accessTokenSecret = process.env.SECRET_Key

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, accessTokenSecret, (err, payload) => {
      if (err) return res.sendStatus(403);
  
      req.user = payload.username;
      next();
    });
  }
  

  function generateAccessToken(user) {
    const payload = {
      username: user.username,
      timestamp: Date.now()
    };
    return jwt.sign(payload, accessTokenSecret, { expiresIn: '30m' });
  }
  
  

app.get('/', (request, response) => {
    response.send('Hello world');
});


app.get('/user-password', (req, res) => {
    user.selectAllUsers().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err);
    });

});

app.post('/check-user-password', (req, res) => {

    const { error } = validateUserPasswd(req.body);     //eq to result.error
    // if invalid, return 400 - Bad request
    if (error) return res.status(400).send(error.details[0].message);

    user.checkUserPassword(req.body.username, req.body.password).then((result) => {
        const token = generateAccessToken({ username: req.body.username });
        res.json({result, token});
    }).catch((err) => {
        console.log(err);
        res.json({err});
    });

});


function validateUserPasswd(user_passwd) {
    const schema = Joi.object({
        username: Joi.string()
            .regex(/^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/)
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,30}$/)
            .required()
    });

    return schema.validate(user_passwd);
}


const signUpSchema = Joi.object({
    username: Joi.string()
      .regex(/^[a-z0-9]+$/)
      .min(3)
      .max(30)
      .required(),
    First_name: Joi.string()
      .min(1)
      .max(35)
      .required(),
    Last_name: Joi.string()
      .min(1)
      .max(35)
      .required(),
    phn_number: Joi.string()
      .length(10)
      .regex(/^[0-9]+$/)
      .required(),
    email: Joi.string()
      .max(35)
      .regex(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)
      .required(),
    password: Joi.string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,30}$/)
      .required(),
    C_password: Joi.string()
      .valid(Joi.ref('password'))
      .required(),
  });

  
  app.post('/do-signup', (req, res) => {
    const { error } = signUpSchema.validate(req.body);
    if (error) {
      console.log(`sign-up error in validate : ${JSON.stringify(error)}`);
      return res.status(400).json(error.details[0].message);
    }
  

    user.doSignUp(req.body)
      .then((result) => {
        const token = generateAccessToken({ username: req.body.username });
        console.log(JSON.stringify({token}));
        res.json({token});
      })
      .catch((err) => {
        console.log(`sign-up error : ${JSON.stringify(err)}`);
        res.status(400).json(err);
      });
  });

// Authenticate all other routes using authenticateToken()

app.get('/profile/:profile_id', authenticateToken,(req, res) => {

    user.getProfileDetails(req.params.profile_id).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err);
    });

});

const postSchema = Joi.object({
    username: Joi.string().required(),
    title: Joi.string().max(80).required(),
    meal: Joi.string().max(80).required(),
    cuisine: Joi.string().max(80).required(),
    recipe: Joi.string().max(3000).regex(/^[^'"]*$/),
    caption: Joi.string().max(300),
}).options({ allowUnknown: true }).unknown(true).strict(false);

  
  app.post('/new-post',authenticateToken, (req, res) => {
    console.log(req.body);
    const { error } = postSchema.validate(req.body);
    if (error) {
      console.log(`Create new post error : ${JSON.stringify(error)}`);
      return res.status(400).send(error.details[0].message);
    }
  
    post.createNewPost(req.body).then((result) => {
      res.send(result);
    }).catch((err) => {
      console.log(`Create new post error : ${JSON.stringify(err)}`);
      res.send(err);
    });
  });


app.get('/posts',authenticateToken,(req,res) => {
    post.getAllPosts().then((result)=>{
        return res.status(200).json(result)
    }).catch((err)=>{
        res.json(err);
    })
})

app.delete('/delete-post/:postId',authenticateToken, (req, res) => {
    const postId = req.params.postId;
    post.deletePostById(postId).then((result)=>{
        res.status(200).json({ success: `Post with postId ${postId} has been deleted.` });
    }).catch((err)=>{
        res.status(400).json({error: "Failed to delete the post."})
    })
  });


app.get('/posts/:meal', authenticateToken, (req, res) => {
    post.getPostsByMeal(req.params.meal).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log('Fetch posts failed!');
        res.send(err);
    })
})


app.get('/search/:value', authenticateToken, (req, res) => {
    user.searchByValue(req.params.value).then((result) => {
        console.log(result);
        res.json(result);
    }).catch((err) => {
        console.log(`Search profiles failed!`)
        res.json(err);
    })
})

app.post('/follow/:followerid', authenticateToken, (req, res) => {
    followers.doFollow(req.body).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })

})

app.get('/Homepage/:username', authenticateToken, (req, res) => {
    console.log(req.params.username)
    user.getProfileDetails(req.params.username).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})


app.post('/do-follow', authenticateToken, (req, res) => {
    console.log(req.body)
    followers.doFollow(req.body).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})


app.post('/do-unfollow', authenticateToken, (req, res) => {
    console.log(req.body)
    followers.doUnFollow(req.body).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})


app.post('/toggle-follow', authenticateToken, (req,res) => {
    console.log(req.body);
    if(req.body.isFollowing){
        const user = {
            userid : req.body.otherUsername,
            followerid : req.body.username
        }
        followers.doFollow(user).then((result)=>{
            res.status(200).json({success : {isfollowing : true}});
        }).catch((err)=>{
            console.log(err);
            res.status(400).json({error : err})
        })
    }
    else{
        const user = {
            userid : req.body.otherUsername,
            followerid : req.body.username
        }
        followers.doUnFollow(user).then((result)=>{
            console.log(result)
            res.status(200).json({success : {isfollowing : false}})
        }).catch((err)=>{
            console.log(err);
            res.status(400).json({error : err});
        })
    }
})

app.post('/is-following', authenticateToken, (req,res)=>{
    followers.isFollowing(req.body.username,req.body.followername).then((result)=>{
        res.status(200).json({success : result});
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({error : err});
    })
})


const editProfileSchema = Joi.object({
    username: Joi.string()
      .regex(/^[a-z0-9]+$/)
      .min(3)
      .max(30)
      .required(),
    First_name: Joi.string()
      .min(1)
      .max(35)
      .required(),
    Last_name: Joi.string()
      .min(1)
      .max(35)
      .required(),
    phn_number: Joi.string()
      .length(10)
      .regex(/^[0-9]+$/)
      .required(),
    email: Joi.string()
      .max(35)
      .regex(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/)
      .required(),
    bio: Joi.string()
      .max(100)
      .regex(/^[a-zA-Z0-9\s.,!?@$#&*]+$/),
    token: Joi.string(),
  });
  
  

app.post('/edit-profile', authenticateToken, (req,res)=>{
    console.log(req.body)
    const { error } = editProfileSchema.validate(req.body);
    if (error) {
      console.log(`sign-up error in validate : ${JSON.stringify(error)}`);
      return res.status(400).json(error.details[0].message);
    }
    user.editProfile(req.body).then((result)=>{
        console.log(result);
        res.send(result);
    }).catch((err)=>{
        console.log(err);
        res.send(err);
    })
});


app.post('/like-post', authenticateToken, (req,res)=>{
    console.log(req);
    likes.doLikePost(req.body.postID, req.body.userID).then((result)=>{
        console.log(result)
        res.send(result)
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
})


app.post('/dislike-post', authenticateToken, (req,res)=>{
    console.log(req);
    likes.disLikePost(req.body.postID, req.body.userID).then((result)=>{
        console.log(result)
        res.send(result)
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
})

app.post('/update-like-status', authenticateToken, (req,res)=>{
    if(req.body.likeStatus){
        likes.doLikePost(req.body.postID,req.body.userID).then((result)=>{
            res.json(result);
        }).catch((err)=>{
            res.json(err);
        })
    }
    else{
        likes.disLikePost(req.body.postID,req.body.userID).then((result) => {
            res.json(result)
        }).catch((err)=>{
            res.json(err);
        })
    }
})

app.get('/no-of-likes/:postID', authenticateToken, (req,res)=>{
    likes.getNoOfLikes(req.params.postID).then((result)=>{
        res.send(result)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.post('/is-liked', authenticateToken, (req,res)=>{
    likes.isLiked(req.body.postID, req.body.userID).then(response =>{
        res_body = {
            "status" : response
        }
        res.send(res_body)
    }).catch(err=>{
        console.log(err)
        res.send(err)
    })
})

app.get('/get-user-posts/:username', authenticateToken, (req,res)=>{
    post.getPostByUserID(req.params.username).then((result)=>{
        console.log(result)
        res.status(200).json(result);
    }).catch((err)=>{
        console.log(err)
        res.status(400).json(err);
    })
})


app.get('/comments/:postID', authenticateToken, (req, res) => {
    const postID = req.params.postID;
    comments.getAllComments(postID)
      .then((result) => {
        return res.status(200).json({result : result});
      })
      .catch((err) => {
        res.json({err : err});
      });
  });
  
  app.get('/comments/no-of-comments/:postID', authenticateToken, (req,res)=>{
    const postID = req.params.postID;
    comments.getNoOfComments(postID)
      .then((result) => {
        return res.status(200).json({result : result});
      })
      .catch((err) => {
        res.json({err : err});
      });
  });


  app.post('/comments', authenticateToken, (req, res) => {
    const { postID, userID, comment } = req.body;
    comments.addComment(postID, userID, comment)
      .then((result) => {
        return res.status(201).json({ message: 'Comment added successfully' });
      })
      .catch((err) => {
        res.json(err);
      });
  });
  
  app.post('/save', authenticateToken, (req, res) => {
    const { postID, userID } = req.body;
  
    post.savePost(postID, userID)
      .then((result) => {
        return res.status(201).json({ message: 'Post saved successfully...' });
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.post('/unsave', authenticateToken, (req, res) => {
    const { postID, userID } = req.body;
  
    post.unsavePost(postID, userID)
      .then((result) => {
        return res.status(200).json({ message: 'Post unsaved successfully...' });
      })
      .catch((err) => {
        res.json(err);
      });
  });
  

  app.get('/get-saved-posts/:userID', authenticateToken, (req, res) => {
    post.getSavedPosts(req.params.userID)
      .then(async (result) => {
        const postIds = result.map((post) => post.postid);
        const resultArray = await Promise.all(postIds.map(async (postId) => {
          const post1 = await post.getPostByPostID(postId);
          return post1;
        }));
        console.log(resultArray);
        return res.status(200).json({ resultArray });
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  });

  app.get('/is-saved/:userID/:postID', authenticateToken, (req, res) => {
    post.isPostSavedByUser(req.params.userID, req.params.postID)
      .then((result) => {
        return res.status(200).json({ isSaved: result });
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  });
  


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`))

