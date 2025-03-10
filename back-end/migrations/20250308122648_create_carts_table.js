/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.raw(`
        CREATE TABLE carts (
          id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          product_id BIGINT UNSIGNED NOT NULL,  -- Samakan dengan products.id
          quantity INT DEFAULT 1 CHECK (quantity > 0),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );
      `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.down = async function (knex) {
    await knex.raw(`DROP TABLE carts;`);
};

