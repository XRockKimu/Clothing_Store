// hash.js
import bcrypt from 'bcrypt';

const password = 'admin';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }
  console.log("Hashed password:", hash);
});