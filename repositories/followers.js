const pool = require('./connection');

const doFollow = async (user_obj) => {
    try {
      const client = await pool.connect();
      const query = `
        CREATE TABLE IF NOT EXISTS user_follower (
          userid VARCHAR(255) NOT NULL ,
          followerid VARCHAR(255) NOT NULL,
          PRIMARY KEY (userid,followerid) 
        );
  
        INSERT INTO user_follower (userid, followerid) VALUES ('${user_obj.userid}', '${user_obj.followerid}');
      `;
      const result = await client.query(query);
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  

  const doUnFollow = async (user_obj) => {
    try {
      const client = await pool.connect();
      const query = `DELETE FROM user_follower WHERE userid = '${user_obj.userid}' AND followerid = '${user_obj.followerid}'`;
      console.log(query);
      const result = await client.query(query);
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  

  const getFollowersList = async (user_id) => {
    try {
      const client = await pool.connect();
      const query = `SELECT followerid FROM user_follower WHERE userid = ${user_id}`;
      console.log(query);
      const result = await client.query(query);
      const response = result.rows.map(row => row.followerid);
      client.release();
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  

  module.exports = {
    getFollowersList,
    doUnFollow,
    doFollow
  }