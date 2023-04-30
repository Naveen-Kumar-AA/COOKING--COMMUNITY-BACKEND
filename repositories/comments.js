const pool = require('./connection');


const addComment = async (postID, userID, comment) => {
    try {
      const client = await pool.connect();
      const query = `
      CREATE TABLE IF NOT EXISTS comments (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        comment VARCHAR(1000) NOT NULL,
        PRIMARY KEY (postid, userid, comment),
        CONSTRAINT fk_comments_post FOREIGN KEY (postid) REFERENCES posts(post_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_comments_user FOREIGN KEY (userid) REFERENCES users(username)
          ON DELETE CASCADE
      );
  
        INSERT INTO comments (postid, userid, comment) VALUES (${postID}, '${userID}', '${comment}');
      `;
      const result = await client.query(query);
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
      const query = `
      CREATE TABLE IF NOT EXISTS comments (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        comment VARCHAR(1000) NOT NULL,
        PRIMARY KEY (postid, userid, comment),
        CONSTRAINT fk_comments_post FOREIGN KEY (postid) REFERENCES posts(post_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_comments_user FOREIGN KEY (userid) REFERENCES users(username)
          ON DELETE CASCADE
      );
        SELECT * FROM comments WHERE postid = '${postID}';
      `;
      const result = await client.query(query);
      client.release();
      return result[1].rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  
  const getNoOfComments = async (postID) => {
    try{
        const client = await pool.connect();
      const query = `
      CREATE TABLE IF NOT EXISTS comments (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        comment VARCHAR(1000) NOT NULL,
        PRIMARY KEY (postid, userid, comment),
        CONSTRAINT fk_comments_post FOREIGN KEY (postid) REFERENCES posts(post_id)
          ON DELETE CASCADE,
        CONSTRAINT fk_comments_user FOREIGN KEY (userid) REFERENCES users(username)
          ON DELETE CASCADE
      );
      
        SELECT COUNT(comment) FROM comments WHERE postid = '${postID}';
      `;
      const result = await client.query(query);
      console.log(result);
      client.release();
      return result[1].rows;
    }catch (err) {
        return err
    }
  }


  module.exports = {
    addComment,
    getAllComments,
    getNoOfComments,
  }
  

