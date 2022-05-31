const express = require('express')
const Joi = require('joi');
const app = express();
const cors = require('cors');
const db = require('./oracle.js')

app.use(cors())
app.use(express.json());

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' },
];

app.get('/', (request, response) => {
    response.send('Hello world');
});

// app.get('/api/courses', (request, result) => {
//     result.send(courses);
// });

// app.get('/api/courses/:id', (req, res) => {
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) return res.status(404).send('The course with the given id was not found');//404 - object not found
//     res.send(course);
// });

app.get('/user-password', (req, res) => {
    // res.send(courses);
    // console.log(db.selectAllUsers())
    // res.send(db.selectAllUsers())
    db.selectAllUsers().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err);
    });

});


// app.post('/api/courses', (req, res) => {

//     const { error } = validateCourse(req.body);     //eq to result.error
//     // if invalid, return 400 - Bad request
//     if (error) return res.status(400).send(error.details[0].message);


//     // const schema = {
//     //     name : Joi.string().min(3).required()
//     // };

//     // const result = Joi.validate(req.body, schema);
//     // console.log(result)

//     // if(result.error){
//     //     res.status(400).send(result.error.details[0].message);
//     //     return
//     // }

//     const course = {
//         id: courses.length + 1,
//         name: req.body.name
//     };

//     courses.push(course);
//     res.send(course);
// });

app.post('/check-user-password', (req, res) => {

    const { error } = validateUserPasswd(req.body);     //eq to result.error
    // if invalid, return 400 - Bad request
    if (error) return res.status(400).send(error.details[0].message);

    db.checkUserPassword(req.body.username, req.body.password).then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err);
    });
    
});


// app.put('/api/courses/:id', (req, res) => {
//     // look up the course
//     // if not existing, return 404
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) return res.status(404).send('The course with the given id was not found');//404 - object not found



//     // // validate
//     // const schema = {                                  // Put this into a
//     //     name : Joi.string().min(3).required()         // function to  
//     // };                                                // reuse

//     // const result = Joi.validate(req.body, schema);

//     // const result = validateCourse(req.body);
//     const { error } = validateCourse(req.body);     //eq to result.error
//     // if invalid, return 400 - Bad request
//     if (error) return res.status(400).send(error.details[0].message);


//     // update course
//     course.name = req.body.name;

//     // return the updated course
//     res.send(course);

// });


// function validateCourse(course) {
//     const schema = {                                  // Put this into a
//         name: Joi.string().min(3).required()         // function to  
//     };                                                // reuse

//     return Joi.validate(course, schema);
// }

function validateUserPasswd(user_passwd) {
    const schema = {                                    
        username: Joi.string().required(),
        password: Joi.string().required()
    };  

    return Joi.validate(user_passwd, schema);
}


// app.delete('/api/courses/:id', (req, res) => {
//     // Look up for the course
//     // Not existing, return 404
//     const course = courses.find(c => c.id === parseInt(req.params.id));
//     if (!course) return res.status(404).send('The course with the given id was not found');//404 - object not found


//     // Delete
//     const index = courses.indexOf(course);
//     courses.splice(index, 1);    //Go to the index and remove one object



//     // Return the same course
//     res.send(course)

// });


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`))
