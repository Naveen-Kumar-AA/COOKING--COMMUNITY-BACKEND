const pool = require('./connection');


const addComment = async (postID, userID, comment) => {
    try {
      const client = await pool.connect();
      const createTable = `
      CREATE TABLE IF NOT EXISTS comments (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        comment VARCHAR(1000) NOT NULL,
        PRIMARY KEY (postid, userid, comment),
        CONSTRAINT fk_comments_post FOREIGN KEY (postid) REFERENCES posts(post_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_comments_user FOREIGN KEY (userid) REFERENCES users(username)
          ON DELETE CASCADE
      );`;
      const query = `
        INSERT INTO comments (postid, userid, comment) VALUES ($1, $2, $3);
      `;
      await client.query(createTable);
      const values = [postID,userID,comment];
      const result = await client.query(query,values);
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getAllComments = async (postID) => {
    try {
      const client = await pool.connect();
      const createTable = `
      CREATE TABLE IF NOT EXISTS comments (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        comment VARCHAR(1000) NOT NULL,
        PRIMARY KEY (postid, userid, comment),
        CONSTRAINT fk_comments_post FOREIGN KEY (postid) REFERENCES posts(post_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_comments_user FOREIGN KEY (userid) REFERENCES users(username)
          ON DELETE CASCADE
      );`
      const query = `
        SELECT * FROM comments WHERE postid = '${postID}';
      `;
      await client.query(createTable);
      const result = await client.query(query);
      client.release();
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  const getNoOfComments = async (postID) => {
    try{
        const client = await pool.connect();
        const createTable = `
      CREATE TABLE IF NOT EXISTS comments (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        comment VARCHAR(1000) NOT NULL,
        PRIMARY KEY (postid, userid, comment),
        CONSTRAINT fk_comments_post FOREIGN KEY (postid) REFERENCES posts(post_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_comments_user FOREIGN KEY (userid) REFERENCES users(username)
          ON DELETE CASCADE
      );`;
      const query = `      
        SELECT COUNT(comment) FROM comments WHERE postid = '${postID}';
      `;
      await client.query(createTable);
      const result = await client.query(query);
      console.log(result);
      client.release();
      return result.rows;
    }catch (err) {
        return err
    }
  }


  module.exports = {
    addComment,
    getAllComments,
    getNoOfComments,
  }
  

