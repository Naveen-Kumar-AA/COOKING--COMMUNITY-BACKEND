// import res from "express/lib/response";
const oracledb = require('oracledb')

con_str = "localhost/XEPDB1"

oracledb.getConnection(
    {
        user:'sys',
        password:'1025',
        privilege: oracledb.SYSDBA,
        tns:con_str
    },
    (err, con) => {
        if(err){
            console.log(err);
            // res.send('db con error');
            console.log("Connection error!");
        }
        else{
            const query = "SELECT * FROM \"_USER\""
            con.execute(query,{},{autoCommit:true},function(e,s){
                if(e){
                    // res.send(e);
                    console.log(e);
                    console.log("Query error!")
                }
                else{
                    console.log(s);
                    // res.send(s);
                    console.log("Query success!")
                }
            });
        }
    }
);