// import res from "express/lib/response";
const { response } = require('express');
const oracledb = require('oracledb');
// const Connection = require('oracledb/lib/connection');
// const db_con = require('./oracle-conn.js')


// const conn = db_con.establish_conn();

con_str = "localhost/XEPDB1"
// const selectAllUsers = () => {

//     return new Promise((resolve, reject) => {


//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = "SELECT * FROM \"_USER\""
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     return resolve(result.rows)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });

//     });

// };



// const checkUserPassword = (username, password) => {

//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `SELECT * FROM \"_USER\" WHERE USERNAME = '${username}' AND PASSWORD = '${password}'`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     // return resolve(result.rows)
//                     console.log(result.rows)
//                     return resolve(result.rows)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });

//     });

// };





// const getProfileDetails = (username) => {

//     return new Promise((resolve, reject) => {


//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `SELECT * FROM \"_PROFILE\" WHERE USERNAME = '${username}'`
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     // console.log(JSON.stringify(result.rows)[0])
//                     const user = result.rows[0];
//                     // console.log(result.rows)
//                     // return resolve({ username: user[0], first_name: user[1], last_name: user[2], bio: user[3], email: user[4], phn_number: user[5] })
//                     // const followersQuuery = `select count(*) from  "_USER_FOLLOWER" WHERE USERID = '${username}'`
//                     const followersQuuery = `select getFollowers('${username}'), getFollowing('${username}') FROM dual`
//                     conn.execute(followersQuuery, {}, { autoCommit: true })
//                         .then((followers) => {
//                             const no_of_followers = followers.rows[0][0];
//                             const no_of_following = followers.rows[0][1];
//                             console.log(followers);
//                             return resolve({ username: user[0], first_name: user[1], last_name: user[2], bio: user[3], email: user[4], phn_number: user[5], no_of_followers: no_of_followers, no_of_following: no_of_following })
//                         }).catch((err) => {
//                             reject(err);
//                         });

//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });

//     });

// };



// const checkUsernameExist = (username) => {

//     return new Promise((resolve, reject) => {

//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {
//             // console.log(username)
//             const query = `select username from "_PROFILE" where username = '${username}'`
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     // if(result.rows.length <= 0){
//                     // return reject(new Error("Username doesn't exists"));
//                     // } else {
//                     return resolve(result.rows);
//                     // }
//                 }).catch((err) => {
//                     console.log(`printing error : ${err}`)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// };

// const doSignUp = (signup_details) => {
//     return new Promise((resolve, reject) => {

//         checkUsernameExist(signup_details.username).then((rows) => {

//             if (rows.length <= 0) {
//                 console.log(signup_details)
//                 oracledb.getConnection({
//                     user: 'SYS',
//                     password: '1025',
//                     privilege: oracledb.SYSDBA,
//                     tns: con_str
//                 }).then((conn) => {
//                     const insert_username_password = `INSERT INTO "_USER" VALUES('${signup_details.username}','${signup_details.password}')`
//                     console.log(insert_username_password)
//                     conn.execute(insert_username_password, {}, { autoCommit: true })
//                         .then((result) => {
//                             // return resolve(result)
//                         }).catch((err) => {
//                             console.log(`insertion failed`)
//                             return reject(err)
//                         })

//                     const query = `INSERT INTO "_PROFILE" VALUES('${signup_details.username}','${signup_details.First_name}','${signup_details.Last_name}','','${signup_details.email}','${signup_details.phn_number}')`
//                     console.log(query)
//                     conn.execute(query, {}, { autoCommit: true })
//                         .then((result) => {
//                             return resolve(result)
//                         }).catch((err) => {
//                             // console.log(`insertion failed`)
//                             return reject(err)
//                         })

//                 }).catch((err) => {
//                     // console.log(`connection failed`);
//                     return reject(err)
//                 });
//             }

//             else {
//                 return reject({
//                     "error": "Username already exists"
//                 })
//             }
//         })
//     });

// }



// const createNewPost = (body) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {
//             getNewPostID().then((newPostID) => {
//                 const query = `INSERT INTO "_REO_POSTS" VALUES(${newPostID},'${body.title}','${body.meal}','${body.cuisine}','${body.recipe}','${body.caption}', '${body.username}', sysdate)`
//                 console.log(query)
//                 conn.execute(query, {}, { autoCommit: true })
//                     .then((result) => {
//                         return resolve(result)
//                     }).catch((err) => {
//                         // console.log(`insertion failed`)
//                         return reject(err)
//                     })
//             }).catch((err) => {
//                 return reject("Getting new post id failed : ", err)
//             })


//         }).catch((err) => {
//             // console.log(`connection failed`);
//             return reject(err)
//         });


//     })


// }


// const getNewPostID = () => {

//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = "select reo_post_id_seq.nextval from dual"
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     // console.log(result.rows[0][0])
//                     return resolve(result.rows[0][0])
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });

//     })

// }



// const getPostsByMeal = (meal) => {
//     return new Promise((resolve, reject) => {

//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `SELECT * FROM "_REO_POSTS" WHERE lower(MEAL) = '${meal}'`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {

//                     const body = result.rows
//                     const resp = body.map((recipe) => {
//                         const timestamp = new Date(recipe[7])
//                         const date = timestamp.toLocaleString();
//                         return new Promise((resolve, reject) => {
//                             getNoOfLikes(recipe[0]).then((likesCount) => {
//                                 body_obj = { postID: recipe[0], title: recipe[1], meal: recipe[2], cuisine: recipe[3], recipe_content: recipe[4], caption: recipe[5], username: recipe[6], date: date, likes: likesCount }
//                                 resolve(body_obj)
//                             }).catch((err) => {
//                                 reject(err)
//                             })
//                         });
//                     });
//                     Promise.all(resp).then(res => { resolve(res); }).catch((err) => { console.log(err); });

//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }


// const doFollow = (user_obj) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `INSERT INTO "_USER_FOLLOWER" VALUES('${user_obj.userid}','${user_obj.followerid}')`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     resolve(result)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }

// const doUnFollow = (user_obj) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `DELETE FROM "_USER_FOLLOWER" WHERE USERID = '${user_obj.userid}' AND FOLLOWERID = '${user_obj.followerid}'`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     resolve(result)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }




// const searchByValue = (value) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `SELECT USERNAME FROM "_PROFILE" WHERE USERNAME LIKE '%${value}%'`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     const body = result.rows
//                     console.log(body)
//                     resolve(result.rows)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }


// const getFollowersList = (user_id) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `SELECT FOLLOWERID FROM "_USER_FOLLOWER" WHERE = ${user_id} `
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     const body = result.rows
//                     response = []
//                     for (const follower_id of body) {
//                         response.push(follower_id[0])
//                     }
//                     resolve(response)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }

// const getOtherProfileDetails = (username) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {
//             const query = `select * from "_PROFILE" where username = '${username}'`
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     const arr = result.rows
//                     const profile_obj = arr.map((element,index)=>{
//                         return {
//                             "username" : element[0],
//                             "first_name" : element[1],
//                             "last_name" : element[2],
//                             "bio" : element[3],
//                             "email" : element[4],
//                             "phn_number" : element[5]
//                         }
//                     })

//                     return resolve(profile_obj);        
//                 }).catch((err) => {
//                     console.log(`Other profile fetch error! : ${err}`)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });


//     })
// }

// const editProfile = (newProfile) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `UPDATE "_PROFILE" SET fname = '${newProfile.first_name}', lname = '${newProfile.last_name}', bio = '${newProfile.bio}', email = '${newProfile.email}', phn_no = ${newProfile.phn_no} WHERE username = '${newProfile.username}'`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     console.log(result)
//                     resolve(result)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }


// const doLikePost = (postId, userID) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `INSERT INTO "_LIKES" VALUES(${postId},'${userID}')`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     console.log(result)
//                     resolve(result)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }


// const disLikePost = (postID, userID) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `DELETE FROM "_LIKES" WHERE POSTID = ${postID} AND USERID = '${userID}'`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     console.log(result)
//                     resolve(result)
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }



// const getNoOfLikes = (postID) => {
//     return new Promise((resolve, reject) => {
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `SELECT COUNT(*) FROM "_LIKES" WHERE POSTID = ${postID}`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     // console.log(result.rows[0][0])
//                     resolve(result.rows[0][0])
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }



// const isLiked = (postID,userID)=>{
//     return new Promise((resolve,reject)=>{
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `SELECT COUNT(*) FROM "_LIKES" WHERE POSTID = ${postID} AND USERID = '${userID}'`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {
//                     console.log(result.rows[0][0])
//                     resolve(result.rows[0][0])
//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });        
//     })
// }


// const getPostByUserID = (userID)=>{
//     return new Promise((resolve,reject)=>{
//         oracledb.getConnection({
//             user: 'SYS',
//             password: '1025',
//             privilege: oracledb.SYSDBA,
//             tns: con_str
//         }).then((conn) => {

//             const query = `SELECT * FROM "_REO_POSTS" WHERE USERNAME = '${userID}'`
//             console.log(query)
//             conn.execute(query, {}, { autoCommit: true })
//                 .then((result) => {

//                     const body = result.rows
//                     const resp = body.map((recipe) => {
//                         const timestamp = new Date(recipe[7])
//                         const date = timestamp.toLocaleString();
//                         return new Promise((resolve, reject) => {
//                             getNoOfLikes(recipe[0]).then((likesCount) => {
//                                 body_obj = { postID: recipe[0], title: recipe[1], meal: recipe[2], cuisine: recipe[3], recipe_content: recipe[4], caption: recipe[5], username: recipe[6], date: date, likes: likesCount }
//                                 resolve(body_obj)
//                             }).catch((err) => {
//                                 reject(err)
//                             })
//                         });
//                     });
//                     Promise.all(resp).then(res => { resolve(res); }).catch((err) => { console.log(err); });

//                 }).catch((err) => {
//                     console.log(err)
//                     return reject(err)
//                 })

//         }).catch((err) => {
//             console.log(err);
//             return reject(err)
//         });
//     })
// }


module.exports = {
    selectAllUsers,
    checkUserPassword,
    getProfileDetails,
    doSignUp,
    createNewPost,
    getPostsByMeal,
    doFollow,
    doUnFollow,
    // getOtherProfileDetails
    searchByValue,
    editProfile,
    doLikePost,
    disLikePost,
    getNoOfLikes,
    isLiked,
    getPostByUserID
}