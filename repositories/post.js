const pool = require('./connection');


const createLikesTable = async () => {
    let client = null;
    try {
      client = await pool.connect()
      const query = `
      CREATE TABLE IF NOT EXISTS likes (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        PRIMARY KEY (postid, userid),
        FOREIGN KEY (postid) REFERENCES posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (userid) REFERENCES users(username) ON DELETE CASCADE
      );
      
      ` 
      await client.query(query)
    } catch (err) {
      console.log('Error creating likes table in PostgreSQL', err)
      throw err
    } finally {
      if (client) client.release()
    }
  }

  const createPostsTableIfNotExists = async () => {
    const client = await pool.connect();
    const createPostTable = `
    CREATE TABLE IF NOT EXISTS posts (
      post_id SERIAL PRIMARY KEY,
      title TEXT,
      meal TEXT,
      cuisine TEXT,
      recipe TEXT,
      caption TEXT,
      username TEXT REFERENCES users(username) on DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    );
    
    `;
  
    try {
      const res = await client.query(createPostTable);
      return Promise.resolve(res);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      client.release();
    }
  };
  


  const createNewPost = async (body) => {
    await createLikesTable();
    const client = await pool.connect();
    const createPostTable = `
    CREATE TABLE IF NOT EXISTS posts (
      post_id SERIAL PRIMARY KEY,
      title TEXT,
      meal TEXT,
      cuisine TEXT,
      recipe TEXT,
      caption TEXT,
      username TEXT REFERENCES users(username) on DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    );
    `;
  
    try {
      // Create table if it doesn't exist
      await client.query(createPostTable);
  
      // Get new post ID
      const newPostIDResult = await client.query('SELECT nextval(\'posts_post_id_seq\')');
      const newPostID = newPostIDResult.rows[0].nextval;
  
      // Insert into posts table
      const insertPostQuery = `
        INSERT INTO posts (post_id, title, meal, cuisine, recipe, caption, username)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      const insertPostValues = [newPostID, body.title, body.meal, body.cuisine, body.recipe, body.caption, body.username];
      const result = await client.query(insertPostQuery, insertPostValues);
      return Promise.resolve(result);
  
    } catch (e) {
      return Promise.reject(e);
    } finally {
      client.release();
    }
  };
  
  const getNoOfLikes = async (postId) => {
    const client = await pool.connect();
    const query = `
      SELECT COUNT(*) FROM likes
      WHERE postid = $1
    `;
    try {
      const result = await client.query(query, [postId]);
      const likesCount = result.rows[0].count;
      return Promise.resolve(likesCount);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      client.release();
    }
  };
  

  const getPostsByMeal = async (meal) => {
    await createPostsTableIfNotExists();
    const client = await pool.connect();
    const query = `
      SELECT * FROM posts
      WHERE LOWER(meal) = $1
    `;
    try {
      const result = await client.query(query, [meal]);
      const rows = result.rows;
  
      const body = rows.map((recipe) => {
        const timestamp = new Date(recipe.created_at);
        const date = timestamp.toLocaleString();
        return new Promise((resolve, reject) => {
          getNoOfLikes(recipe.post_id).then((likesCount) => {
            const body_obj = { 
              postID: recipe.post_id, 
              title: recipe.title, 
              meal: recipe.meal, 
              cuisine: recipe.cuisine, 
              recipe_content: recipe.recipe, 
              caption: recipe.caption, 
              username: recipe.username, 
              date: date, 
              likes: likesCount 
            };
            resolve(body_obj);
          }).catch((err) => {
            reject(err);
          });
        });
      });
      const results = await Promise.all(body);
      return Promise.resolve(results);
    } catch (e) {
        console.log(e)
      return Promise.reject(e);
    } finally {
      client.release();
    }
  };
  
  const getPostByUserID = async (userID) => {
    let client;
    try {
      await createPostsTableIfNotExists();
      client = await pool.connect();
      const query = `SELECT * FROM posts WHERE username = $1`;
      const result = await client.query(query, [userID]);
      const body = result.rows;
      const resp = body.map((recipe) => {
        const timestamp = new Date(recipe.created_at);
        const date = timestamp.toLocaleString();
        return new Promise((resolve, reject) => {
          getNoOfLikes(recipe.post_id).then((likesCount) => {
            const body_obj = { 
              postID: recipe.post_id, 
              title: recipe.title, 
              meal: recipe.meal, 
              cuisine: recipe.cuisine, 
              recipe_content: recipe.recipe, 
              caption: recipe.caption, 
              username: recipe.username, 
              date: date, 
              likes: likesCount 
            };
            resolve(body_obj);
          }).catch((err) => {
            reject(err);
          });
        });
      });
      const posts = await Promise.all(resp);
      return posts;
    } catch (err) {
      console.log('Error querying PostgreSQL', err);
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  };


  
  const getAllPosts = async () => {
    await createPostsTableIfNotExists();
    const client = await pool.connect();
    const query = `
      SELECT * FROM posts
    `;
    try {
      const result = await client.query(query);
      const rows = result.rows;
  
      const body = rows.map((recipe) => {
        const timestamp = new Date(recipe.created_at);
        const date = timestamp.toLocaleString();
        return new Promise((resolve, reject) => {
          getNoOfLikes(recipe.post_id).then((likesCount) => {
            const body_obj = { 
              postID: recipe.post_id, 
              title: recipe.title, 
              meal: recipe.meal, 
              cuisine: recipe.cuisine, 
              recipe_content: recipe.recipe, 
              caption: recipe.caption, 
              username: recipe.username, 
              date: date, 
              likes: likesCount 
            };
            resolve(body_obj);
          }).catch((err) => {
            reject(err);
          });
        });
      });
      const results = await Promise.all(body);
      return Promise.resolve(results);
    } catch (e) {
        console.log(e)
      return Promise.reject(e);
    } finally {
      client.release();
    }
  };
  

  const deletePostById = async (postId) => {
    await createPostsTableIfNotExists();
    const client = await pool.connect();
    const query = `
      DELETE FROM posts
      WHERE post_id = $1
    `;
    try {
      await client.query(query, [postId]);
      return Promise.resolve();
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    } finally {
      client.release();
    }
  };
  

  const savePost = async (postID, userID) => {
    try {
      const client = await pool.connect();
      const createQuery = `
      CREATE TABLE IF NOT EXISTS saved_posts (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        PRIMARY KEY (postid, userid),
        FOREIGN KEY (postid) REFERENCES posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (userid) REFERENCES users(username) ON DELETE CASCADE
      );
      `;
      const insertQuery = `
        INSERT INTO saved_posts (postid, userid) VALUES ($1, $2)
      `;
      await client.query(createQuery);
      const result = await client.query(insertQuery, [postID, userID]);
      client.release();
      return result;
    } catch (err) {
      return err;
    }
  };

  const unsavePost = async (postID, userID) => {
    try {
      const client = await pool.connect();
      const deleteQuery = `
        DELETE FROM saved_posts WHERE postid = $1 AND userid = $2
      `;
      const result = await client.query(deleteQuery, [postID, userID]);
      client.release();
      return result;
    } catch (err) {
      return err;
    }
  };
  
  const getSavedPosts = async(userID)=>{
    try {
      const client = await pool.connect();
      const createQuery = `
      CREATE TABLE IF NOT EXISTS saved_posts (
        postid INTEGER NOT NULL,
        userid VARCHAR(255) NOT NULL,
        PRIMARY KEY (postid, userid),
        FOREIGN KEY (postid) REFERENCES posts(post_id) ON DELETE CASCADE,
        FOREIGN KEY (userid) REFERENCES users(username) ON DELETE CASCADE
      );
      `;
      const selectQuery = `
        SELECT postid FROM saved_posts WHERE userid = $1;
      `;
      await client.query(createQuery);
      const result = await client.query(selectQuery, [userID]);
      client.release();
      return result.rows;
    } catch (err) {
      return err;
    }
  }

  const isPostSavedByUser = async (userID, postID) => {
    try {
      const savedPosts = await getSavedPosts(userID);
      const savedPostIDs = savedPosts.map((post) => post.postid);
      return savedPostIDs.includes(parseInt(postID));
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  
  
  const getPostByPostID = async (postID) => {
    let client;
    try {
      await createPostsTableIfNotExists();
      client = await pool.connect();
      const query = `SELECT * FROM posts WHERE post_id = $1`;
      const result = await client.query(query, [postID]);
      const body = result.rows[0];
      const likesCount = await getNoOfLikes(body.post_id);
      const timestamp = new Date(body.created_at);
      const date = timestamp.toLocaleString();
      const body_obj = {
        postID: body.post_id,
        title: body.title,
        meal: body.meal,
        cuisine: body.cuisine,
        recipe_content: body.recipe,
        caption: body.caption,
        username: body.username,
        date: date,
        likes: likesCount,
      };
      return body_obj;
    } catch (err) {
      console.log('Error querying PostgreSQL', err);
      throw err;
    } finally {
      if (client) {
        client.release();
      }
    }
  };
  

  module.exports = {
    getPostByUserID,
    getPostsByMeal,
    createNewPost,
    getAllPosts,
    deletePostById,
    savePost,
    unsavePost,
    getSavedPosts,
    getPostByPostID,
    isPostSavedByUser
  }
  