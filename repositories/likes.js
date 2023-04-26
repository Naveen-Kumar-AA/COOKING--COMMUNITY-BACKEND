const pool = require('./connection');

const doLikePost = async (postID, userID) => {
    try {
      const client = await pool.connect();
      const query = `
        CREATE TABLE IF NOT EXISTS likes (
          postid INTEGER NOT NULL,
          userid VARCHAR(255) NOT NULL,
          PRIMARY KEY (postid,userid)
        );
  
        INSERT INTO likes (postid, userid) VALUES ('${postID}', '${userID}');
      `;
      console.log(query);
      const result = await client.query(query);
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  

  const disLikePost = async (postID, userID) => {
    const client = await pool.connect();
    try {
      const query = `DELETE FROM likes WHERE postid = '${postID}' AND userid = '${userID}'`;
      console.log(query);
      const result = await client.query(query);
      console.log(result);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      client.release();
    }
  };

  const createLikesTable = async () => {
    let client = null;
    try {
      client = await pool.connect()
      const query = `
      CREATE TABLE IF NOT EXISTS likes (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        PRIMARY KEY(postid,userid)
      );
      `
      console.log(query)
      await client.query(query)
    } catch (err) {
      console.log('Error creating likes table in PostgreSQL', err)
      throw err
    } finally {
      if (client) client.release()
    }
  }

  

  const getNoOfLikes = async (postID) => {
    let client = null;
    try {
      await createLikesTable() // create the likes table if it doesn't exist
      client = await pool.connect()
      const query = `SELECT COUNT(*) FROM likes WHERE postid = $1`
      console.log(query)
      const result = await client.query(query, [postID])
      // console.log(result.rows[0].count)
      return result.rows[0].count
    } catch (err) {
      console.log('Error querying PostgreSQL', err)
      throw err
    } finally {
      if (client) client.release()
    }
  }
  
  const isLiked = async (postID, userID) => {
    let client = null;
    try {
      await createLikesTable() // create the likes table if it doesn't exist
      client = await pool.connect()
      const query = `SELECT COUNT(*) FROM likes WHERE postid = $1 AND userid = $2`
      console.log(query)
      const result = await client.query(query, [postID, userID])
      console.log(result.rows[0].count)
      return result.rows[0].count > 0
    } catch (err) {
      console.log('Error querying PostgreSQL', err)
      throw err
    } finally {
      if (client) client.release()
    }
  }
  

  module.exports = {
    isLiked,
    doLikePost,
    disLikePost,
    getNoOfLikes
  }