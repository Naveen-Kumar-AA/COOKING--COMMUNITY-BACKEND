// import res from "express/lib/response";
const oracledb = require('oracledb');
// const Connection = require('oracledb/lib/connection');
// const db_con = require('./oracle-conn.js')


// const conn = db_con.establish_conn();

con_str = "localhost/XEPDB1"
const selectAllUsers = () => {

    return new Promise((resolve, reject) => {


        oracledb.getConnection({
            user: 'SYS',
            password: '1025',
            privilege: oracledb.SYSDBA,
            tns: con_str
        }).then((conn) => {

            const query = "SELECT * FROM \"_USER\""
            conn.execute(query, {}, { autoCommit: true })
                .then((result) => {
                    return resolve(result.rows)
                }).catch((err) => {
                    console.log(err)
                    return reject(err)
                })

        }).catch((err) => {
            console.log(err);
            return reject(err)
        });

    });

};



const checkUserPassword = (username, password) => {

    return new Promise((resolve, reject) => {
        oracledb.getConnection({
            user: 'SYS',
            password: '1025',
            privilege: oracledb.SYSDBA,
            tns: con_str
        }).then((conn) => {

            const query = `SELECT * FROM \"_USER\" WHERE USERNAME = '${username}' AND PASSWORD = '${password}'`
            console.log(query)
            conn.execute(query, {}, { autoCommit: true })
                .then((result) => {
                    // return resolve(result.rows)
                    console.log(result.rows)
                    return resolve(result.rows)
                }).catch((err) => {
                    console.log(err)
                    return reject(err)
                })

        }).catch((err) => {
            console.log(err);
            return reject(err)
        });

    });

};





const getProfileDetails = (username) => {

    return new Promise((resolve, reject) => {


        oracledb.getConnection({
            user: 'SYS',
            password: '1025',
            privilege: oracledb.SYSDBA,
            tns: con_str
        }).then((conn) => {

            const query = `SELECT * FROM \"_PROFILE\" WHERE USERNAME = '${username}'`
            conn.execute(query, {}, { autoCommit: true })
                .then((result) => {
                    // console.log(JSON.stringify(result.rows)[0])
                    const user = result.rows[0];
                    // console.log(result.rows)
                    return resolve({ username: user[0], fname: user[1], lname: user[2], bio: user[3], email: user[4], phn_number: user[5] })
                }).catch((err) => {
                    console.log(err)
                    return reject(err)
                })

        }).catch((err) => {
            console.log(err);
            return reject(err)
        });

    });

};



const checkUsernameExist = (username) => {

    return new Promise((resolve, reject) => {

        oracledb.getConnection({
            user: 'SYS',
            password: '1025',
            privilege: oracledb.SYSDBA,
            tns: con_str
        }).then((conn) => {
            // console.log(username)
            const query = `select username from "_PROFILE" where username = '${username}'`
            conn.execute(query, {}, { autoCommit: true })
                .then((result) => {
                    // if(result.rows.length <= 0){
                    // return reject(new Error("Username doesn't exists"));
                    // } else {
                    return resolve(result.rows);
                    // }
                }).catch((err) => {
                    console.log(`printing error : ${err}`)
                    return reject(err)
                })

        }).catch((err) => {
            console.log(err);
            return reject(err)
        });
    })
};

const doSignUp = (signup_details) => {
    return new Promise((resolve, reject) => {

        checkUsernameExist(signup_details.username).then((rows) => {

            if (rows.length <= 0) {
                console.log(signup_details)
                oracledb.getConnection({
                    user: 'SYS',
                    password: '1025',
                    privilege: oracledb.SYSDBA,
                    tns: con_str
                }).then((conn) => {

                    const query = `INSERT INTO "_PROFILE" VALUES('${signup_details.username}','${signup_details.First_name}','${signup_details.Last_name}','','${signup_details.email}','${signup_details.phn_number}')`
                    console.log(query)
                    conn.execute(query, {}, { autoCommit: true })
                        .then((result) => {
                            return resolve(result)
                        }).catch((err) => {
                            // console.log(`insertion failed`)
                            return reject(err)
                        })
                    const insert_username_password = `INSERT INTO "_USER" VALUES('${signup_details.username}','${signup_details.password}')`
                    console.log(insert_username_password)
                    conn.execute(insert_username_password, {}, { autoCommit: true })
                        .then((result) => {
                            // return resolve(result)
                        }).catch((err) => {
                            console.log(`insertion failed`)
                            return reject(err)
                        })

                }).catch((err) => {
                    // console.log(`connection failed`);
                    return reject(err)
                });
            }

            else {
                return reject({
                    "error": "Username already exists"
                })
            }
        })
    });

}



const createNewPost = (body) => {
    return new Promise((resolve, reject) => {
        oracledb.getConnection({
            user: 'SYS',
            password: '1025',
            privilege: oracledb.SYSDBA,
            tns: con_str
        }).then((conn) => {
            getNewPostID().then((newPostID) => {
                const query = `INSERT INTO "_REO_POSTS" VALUES(${newPostID},'${body.title}','${body.meal}','${body.cuisine}','${body.recipe}','${body.caption}', '${body.username}')`
                console.log(query)
                conn.execute(query, {}, { autoCommit: true })
                    .then((result) => {
                        return resolve(result)
                    }).catch((err) => {
                        // console.log(`insertion failed`)
                        return reject(err)
                    })
            }).catch((err)=> {
                return reject("Getting new post id failed : ",err)
            })


        }).catch((err) => {
            // console.log(`connection failed`);
            return reject(err)
        });


    })


}


const getNewPostID = () => {

    return new Promise((resolve, reject) => {
        oracledb.getConnection({
            user: 'SYS',
            password: '1025',
            privilege: oracledb.SYSDBA,
            tns: con_str
        }).then((conn) => {

            const query = "select reo_post_id_seq.nextval from dual"
            conn.execute(query, {}, { autoCommit: true })
                .then((result) => {
                    // console.log(result.rows[0][0])
                    return resolve(result.rows[0][0])
                }).catch((err) => {
                    console.log(err)
                    return reject(err)
                })

        }).catch((err) => {
            console.log(err);
            return reject(err)
        });

    })

}



const getPostsByMeal = (meal) => {
    return new Promise((resolve, reject) => {

        oracledb.getConnection({
            user: 'SYS',
            password: '1025',
            privilege: oracledb.SYSDBA,
            tns: con_str
        }).then((conn) => {

            const query = `SELECT * FROM "_REO_POSTS" WHERE lower(MEAL) = '${meal}'`
            console.log(query)
            conn.execute(query, {}, { autoCommit: true })
                .then((result) => {
                    // console.log(result)
                    const body = result.rows
                    resp = []
                    for (const recipe of body) {
                        body_obj = { postID: recipe[0], title: recipe[1], meal: recipe[2], cuisine: recipe[3], recipe_content: recipe[4], caption: recipe[5] }
                        resp.push(body_obj)
                    }
                    resolve(resp)
                }).catch((err) => {
                    // console.log(err)
                    return reject(err)
                })

        }).catch((err) => {
            console.log(err);
            return reject(err)
        });




    })


}






module.exports = {
    selectAllUsers,
    checkUserPassword,
    getProfileDetails,
    doSignUp,
    createNewPost,
    getPostsByMeal
}