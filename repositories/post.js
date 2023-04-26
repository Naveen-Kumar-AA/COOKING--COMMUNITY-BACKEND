const pool = require('./connection');


const createLikesTable = async () => {
    let client = null;
    try {
      client = await pool.connect()
      const query = `
        CREATE TABLE IF NOT EXISTS likes (
          postid INTEGER NOT NULL,
          userid VARCHAR(255) NOT NULL,
          PRIMARY KEY (postid,userid)
        )
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
        username TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
  
    try {
      const res = await client.query(createPostTable);
      console.log('Posts table created or already exists.');
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
        username TEXT,
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
      console.log(query);
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
  
  module.exports = {
    getPostByUserID,
    getPostsByMeal,
    createNewPost,

  }
  