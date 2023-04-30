const pool = require('./connection');

const selectAllUsers = async () => {
  const client = await pool.connect();

  try {
    const query = 'SELECT * FROM users';
    const { rows } = await client.query(query);
    return rows;
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
};


const checkUserPassword = async (username, password) => {
    const client = await pool.connect();
  
    try {
      const query = 'SELECT * FROM "users" WHERE username = $1 AND password = $2';
      const values = [username, password];
      const result = await client.query(query, values);
      return result.rows;
    } catch (e) {
      throw e;
    } finally {
      client.release();
    }
  };
  
  const createUserFollower = async () => {
    try {
      const client = await pool.connect();
      const query = `
      CREATE TABLE IF NOT EXISTS user_follower (
        userid VARCHAR(255) NOT NULL,
        followerid VARCHAR(255) NOT NULL,
        PRIMARY KEY (userid, followerid),
        FOREIGN KEY (userid) REFERENCES users(username) ON DELETE CASCADE,
        FOREIGN KEY (followerid) REFERENCES users(username) ON DELETE CASCADE
      );
      `;
      const result = await client.query(query);
      client.release();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  

  
  const doSignUp = async (signup_details) => {
    const client = await pool.connect();
    const createUserTable = `
    CREATE TABLE IF NOT EXISTS "users" (
        "username" TEXT PRIMARY KEY,
        "password" TEXT NOT NULL
    );
    `;
  const createProfileTable = `
  CREATE TABLE IF NOT EXISTS "profile" (
    "username" TEXT PRIMARY KEY REFERENCES "users" ("username") on DELETE CASCADE,
    "first_name" TEXT,
    "last_name" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "phn_number" TEXT
  );
    `;
    try {
    
      // Create tables if they don't exist
      await client.query(createUserTable);
      await client.query(createProfileTable);
      await createUserFollower();
      // Check if username already exists
      const checkUsernameQuery = `
        SELECT username
        FROM "profile"
        WHERE username = $1
      `;
      const checkUsernameResult = await client.query(checkUsernameQuery, [signup_details.username]);
  
      if (checkUsernameResult.rows.length > 0) {
        // return Promise.reject({
        //   "error": "Username already exists"
        // });
        return Promise.reject("Username already exists")
      }
  
      // Insert into "user" table
      const insertUserQuery = `
        INSERT INTO "users" (username, password)
        VALUES ($1, $2)
      `;
      const insertUserValues = [signup_details.username, signup_details.password];
      await client.query(insertUserQuery, insertUserValues);
  
      // Insert into "profile" table
      const insertProfileQuery = `
        INSERT INTO "profile" (username, first_name, last_name, bio, email, phn_number)
        VALUES ($1, $2, $3, $4, $5, $6)
      `;
      const insertProfileValues = [signup_details.username, signup_details.First_name, signup_details.Last_name, '', signup_details.email, signup_details.phn_number];
      const result = await client.query(insertProfileQuery, insertProfileValues);
      return Promise.resolve(result);
  
    } catch (e) {
      return Promise.reject(e);
    } finally {
      client.release();
    }
  };
  

  const getProfileDetails = async (username) => {

    const client = await pool.connect();
  
    try {
      // Select user from profile table
      const query = `SELECT * FROM "profile" WHERE username = $1`;
      const result = await client.query(query, [username]);
  
      const user = result.rows[0];
  
      // Select count of followers and following from user_follower table
      const followersQuery = `
        SELECT
          (SELECT COUNT(*) FROM user_follower WHERE followerid = $1) AS followers,
          (SELECT COUNT(*) FROM user_follower WHERE userid = $1) AS following
      `;
      const followersResult = await client.query(followersQuery, [username]);
      const no_of_following = followersResult.rows[0].followers;
      const no_of_followers = followersResult.rows[0].following;
  

      return Promise.resolve({ 
        username: user.username, 
        first_name: user.first_name, 
        last_name: user.last_name, 
        bio: user.bio, 
        email: user.email, 
        phn_number: user.phn_number,
        no_of_followers: no_of_followers,
        no_of_following: no_of_following 
      });

    } catch (e) {
      return Promise.reject(e);
    } finally {
      client.release();
    }
  };

  const checkUsernameExist = async (username) => {
    try {
      const client = await pool.connect();
      const query = `SELECT username FROM profile WHERE username = $1`;
      const result = await client.query(query, [username]);
      client.release();
      return result.rows;
    } catch (e) {
      throw e;
    }
  };
  

  const searchByValue = async (value) => {
    try {
      const client = await pool.connect();
      const query = `SELECT USERNAME FROM profile WHERE USERNAME LIKE '%${value}%'`;
      console.log(query);
      const result = await client.query(query);
      client.release();
      console.log(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  

  const editProfile = async (newProfile) => {
    const client = await pool.connect();
    const query = `UPDATE profile SET first_name = $1, last_name = $2, bio = $3, email = $4, phn_number = $5 WHERE username = $6`;
    const values = [newProfile.First_name, newProfile.Last_name, newProfile.bio, newProfile.email, newProfile.phn_number, newProfile.username ];
    try {
      const result = await client.query(query,values);
      client.release();
      console.log(result);
      return result;
    } catch (err) {
      console.error(err);
      client.release();
      throw err;
    }
  };
  

  module.exports = {
    selectAllUsers,
    checkUserPassword,
    doSignUp,
    getProfileDetails,
    checkUsernameExist,
    searchByValue,
    editProfile
  }