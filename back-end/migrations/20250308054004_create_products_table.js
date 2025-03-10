/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.raw(`
    CREATE TABLE products (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  -- Pakai BIGINT agar aman untuk ID besar
      title VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL CHECK (price > 0),
      description TEXT,
      category VARCHAR(255),
      image TEXT,
      stock INT DEFAULT 0 CHECK (stock >= 0),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.raw(`DROP TABLE products;`);
};
