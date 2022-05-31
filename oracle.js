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

        
        // console.log(conn)
        // const query = "SELECT * FROM \"_USER\""
        // conn.execute(query, {}, { autoCommit: true })
        //     .then((result) => {
        //         return resolve(result.rows)
        //     }).catch((err) => {
        //         return reject(err)
        //     })
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


module.exports = {
    selectAllUsers,
    checkUserPassword
}
