/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
      CREATE TABLE orders (
        id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
        status ENUM('pending', 'completed', 'canceled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.raw(`DROP TABLE orders;`);
};

