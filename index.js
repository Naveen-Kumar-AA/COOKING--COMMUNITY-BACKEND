const express = require('express');
const Joi = require('joi');
const app = express();
const cors = require('cors');
const user = require('./repositories/user.js');
const followers = require('./repositories/followers.js');
const likes = require('./repositories/likes.js');
const post = require('./repositories/post.js');
app.use(cors())
app.use(express.json());


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
        res.send(result)
    }).catch((err) => {
        console.log(err);
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


app.get('/profile/:profile_id', (req, res) => {

    user.getProfileDetails(req.params.profile_id).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err);
    });

});


// app.post('/do-signup', (req, res) => {
//     // console.log(req.body)
//     user.doSignUp(req.body).then((result) => {
//         res.send(result);
//     }).catch((err) => {
//         console.log(`sign-up error : ${JSON.stringify(err)}`);
//         res.send(err);
//     })
// });


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
    console.log(req.body);
    const { error } = signUpSchema.validate(req.body);
    if (error) {
      console.log(`sign-up error : ${JSON.stringify(error)}`);
      return res.status(400).send(error.details[0].message);
    }
  
    user.doSignUp(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(`sign-up error : ${JSON.stringify(err)}`);
        res.send(err);
      });
  });
  



// app.post('/new-post', (req, res) => {
//     console.log(req.body)
//     post.createNewPost(req.body).then((result) => {
//         res.send(result);
//     }).catch((err) => {
//         console.log(`Create new post error : ${JSON.stringify(err)}`);
//         res.send(err);
//     })
// });



const postSchema = Joi.object({
    username: Joi.string().required(),
    title: Joi.string().max(80).required(),
    meal: Joi.string().max(80).required(),
    cuisine: Joi.string().max(80).required(),
    recipe: Joi.string().max(3000).regex(/^[^'"]*$/),
    caption: Joi.string().max(300),
}).options({ allowUnknown: true }).unknown(true).strict(false);

  
  app.post('/new-post', (req, res) => {
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

app.get('/posts/:meal', (req, res) => {
    post.getPostsByMeal(req.params.meal).then((result) => {
        res.send(result);
    }).catch((err) => {
        console.log('Fetch posts failed!');
        res.send(err);
    })
})


app.get('/search/:value', (req, res) => {
    user.searchByValue(req.params.value).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(`Search profiles failed!`)
        res.send(err)
    })
})

app.post('/follow/:followerid', (req, res) => {
    followers.doFollow(req.body).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.send(err);
    })

})

app.get('/Homepage/:username', (req, res) => {
    user.getProfileDetails(req.params.username).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})


app.post('/do-follow', (req, res) => {
    console.log(req.body)
    followers.doFollow(req.body).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})


app.post('/do-unfollow', (req, res) => {
    console.log(req.body)
    followers.doUnFollow(req.body).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})


app.post('/edit-profile', (req,res)=>{
    // console.log(req.body)
    user.editProfile(req.body).then((result)=>{
        res.send(result)
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
})


app.post('/like-post',(req,res)=>{
    console.log(req);
    likes.doLikePost(req.body.postID, req.body.userID).then((result)=>{
        console.log(result)
        res.send(result)
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
})


app.post('/dislike-post',(req,res)=>{
    console.log(req);
    likes.disLikePost(req.body.postID, req.body.userID).then((result)=>{
        console.log(result)
        res.send(result)
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
})


app.get('/no-of-likes/:postID',(req,res)=>{
    likes.getNoOfLikes(req.params.postID).then((result)=>{
        res.send(result)
    })
    .catch((err)=>{
        res.send(err)
    })
})

app.post('/is-liked',(req,res)=>{
    console.log('hi')
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

app.get('/get-user-posts/:userid',(req,res)=>{
    post.getPostByUserID(req.params.userid).then((result)=>{
        console.log(result)
        res.send(result)
    }).catch((err)=>{
        console.log(err)
        res.send(err)
    })
})


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`))

