/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require("bcrypt");

exports.up = async function (knex) {
    await knex.raw(`
    CREATE TABLE users (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    await knex.raw(
        `INSERT INTO users (username, password, role) VALUES (?, ?, ?), (?, ?, ?);`,
        ["admin", adminPassword, "admin", "user", userPassword, "user"]
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.raw(`DROP TABLE users;`);
};
