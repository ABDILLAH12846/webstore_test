const Fastify = require("fastify");
const Knex = require("knex");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const knexConfig = require("./knexfile");
const cors = require("@fastify/cors");

const fastify = Fastify({ logger: true });
fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
const knex = Knex(knexConfig.development);

fastify.decorate("knex", knex);

const importProducts = async () => {
  try {
    const { data } = await axios.get("https://fakestoreapi.com/products");
    for (const product of data) {
      await fastify.knex.raw(
        `INSERT INTO products (title, price, description, category, image, stock) 
         SELECT ?, ?, ?, ?, ?, ? 
         WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = ?);`,
        [product.title, product.price, product.description, product.category, product.image, 10, product.title]
      );
    }
    console.log("Produk berhasil diimport ke database!");
  } catch (error) {
    console.error("Gagal mengimport produk:", error);
  }
};

fastify.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});

fastify.get("/check-db", async (request, reply) => {
  try {
    await fastify.knex.raw("SELECT 1");
    return reply.send({ status: "✅ Database terkoneksi" });
  } catch (error) {
    return reply.code(500).send({ error: "❌ Gagal terkoneksi ke database" });
  }
});

fastify.post("/login", async (request, reply) => {
  const { username, password } = request.body;
  try {
    const user = await fastify.knex.raw("SELECT * FROM users WHERE username = ?", [username]);
    if (user[0].length === 0) {
      return reply.code(401).send({ error: "User tidak ditemukan" });
    }
    const isValid = await bcrypt.compare(password, user[0][0].password);
    if (!isValid) {
      return reply.code(401).send({ error: "Password salah" });
    }
    const token = jwt.sign(
      { id: user[0][0].id, role: user[0][0].role },
      "secret_key",
      { expiresIn: "1h" }
    );
    return reply.send({ message: "Login berhasil!", token, role: user[0][0].role });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal login" });
  }
});

// Products
fastify.get("/products", async (request, reply) => {
  try {
    const result = await fastify.knex.raw("SELECT * FROM products");
    return reply.send(result[0]);
  } catch (error) {
    return reply.code(500).send({ error: "Gagal mengambil data produk" });
  }
});

fastify.get("/products-infinite", async (request, reply) => {
  const { cursor = "0", limit = "10", q = "", user_id } = request.query;

  const parsedCursor = parseInt(cursor, 10);
  const parsedLimit = parseInt(limit, 10);

  if (Number.isNaN(parsedCursor) || Number.isNaN(parsedLimit)) {
    return reply.code(400).send({ error: "Cursor dan limit harus berupa angka" });
  }

  try {
    // Query produk dengan cart_quantity dan cart_id
    const productsResult = await fastify.knex.raw(
      `
      SELECT p.*, 
             COALESCE(c.quantity, 0) AS cart_quantity, 
             CASE 
               WHEN c.quantity > 0 THEN c.id 
               ELSE NULL 
             END AS cart_id
      FROM products AS p
      LEFT JOIN carts AS c ON p.id = c.product_id AND c.user_id = ?
      WHERE p.title LIKE ? AND p.id > ?
      ORDER BY p.id
      LIMIT ?
      `,
      [user_id, `%${q}%`, parsedCursor, parsedLimit]
    );

    const products = productsResult[0] || []; // Pastikan hasil query diakses dengan [0]

    // Query untuk menghitung total produk yang cocok dengan pencarian
    const countResult = await fastify.knex.raw(
      `
      SELECT COUNT(*) AS count
      FROM products
      WHERE title LIKE ?
      `,
      [`%${q}%`]
    );

    const count = countResult[0][0]?.count || 0;

    // Tentukan nextCursor berdasarkan produk terakhir di array
    const nextCursor = products.length === parsedLimit ? products[products.length - 1].id : null;

    return reply.send({
      data: products,
      meta: {
        total: count,
        perPage: parsedLimit,
        nextCursor,
      },
    });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Gagal mengambil produk" });
  }
});

fastify.get("/product/:id", async (request, reply) => {
  const { id } = request.params;
  try {
    const result = await fastify.knex.raw("SELECT * FROM products WHERE id = ?", [id]);
    return reply.send(result[0]);
  } catch (error) {
    return reply.code(500).send({ error: "Gagal mengambil data produk" });
  }
});

fastify.post("/products", async (request, reply) => {
  const { title, price, description, category, image, stock } = request.body;
  try {
    await fastify.knex.raw(
      "INSERT INTO products (title, price, description, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)",
      [title, price, description, category, image, stock]
    );
    return reply.send({ message: "Produk ditambahkan!" });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal menambahkan produk" });
  }
});

fastify.put("/products/:id", async (request, reply) => {
  const { id } = request.params;
  const { title, price, description, category, image, stock } = request.body;
  try {
    await fastify.knex.raw(
      "UPDATE products SET title = ?, price = ?, description = ?, category = ?, image = ?, stock = ? WHERE id = ?",
      [title, price, description, category, image, stock, id]
    );
    return reply.send({ message: "Produk diperbarui!" });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal memperbarui produk" });
  }
});
fastify.put("/update-stock/:id", async (request, reply) => {
  const { id } = request.params;
  const { title, price, description, category, image, stock } = request.body;
  try {
    await fastify.knex.raw(
      "UPDATE products SET stock = stock + ? WHERE id = ?",
      [stock, id]
    );
    return reply.send({ message: "Produk diperbarui!" });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal memperbarui produk" });
  }
});

fastify.delete("/products/:id", async (request, reply) => {
  const { id } = request.params;
  try {
    await fastify.knex.raw("DELETE FROM products WHERE id = ?", [id]);
    return reply.send({ message: "Produk dihapus!" });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal menghapus produk" });
  }
});

// Carts
fastify.get("/cart/:user_id", async (request, reply) => {
  const { user_id } = request.params;
  try {
    const result = await fastify.knex.raw(
      `SELECT carts.id, products.title, products.price, carts.quantity, (products.price * carts.quantity) AS total_price
       FROM carts 
       JOIN products ON carts.product_id = products.id
       WHERE carts.user_id = ?`,
      [user_id]
    );
    return reply.send(result[0]);
  } catch (error) {
    return reply.code(500).send({ error: "Gagal mengambil keranjang" });
  }
});

fastify.get("/cart-infinite/:user_id", async (request, reply) => {
  const { user_id } = request.params;
  const { cursor = 0, limit = 10 } = request.query;
  const parsedLimit = Number(limit);

  try {
    // Ambil data keranjang berdasarkan cursor
    const cartItems = await fastify.knex.raw(
      `SELECT carts.id, products.title, products.price, products.image, carts.quantity, 
              (products.price * carts.quantity) AS total_price
       FROM carts 
       JOIN products ON carts.product_id = products.id
       WHERE carts.user_id = ? AND carts.id > ?
       ORDER BY carts.id 
       LIMIT ?`,
      [user_id, cursor, parsedLimit]
    );

    const total = await fastify.knex.raw(
      `SELECT COUNT(*) AS count FROM carts WHERE user_id = ?`,
      [user_id]
    );

    // Tentukan `nextCursor`
    const nextCursor =
      cartItems[0].length === parsedLimit ? cartItems[0][cartItems[0].length - 1].id : null;

    return reply.send({
      data: cartItems[0], // Data keranjang dengan gambar produk
      meta: {
        total: total[0][0].count,
        perPage: parsedLimit,
        nextCursor, // Cursor untuk halaman berikutnya
      },
    });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal mengambil data keranjang" });
  }
});

fastify.post("/cart", async (request, reply) => {
  const { user_id, product_id, quantity } = request.body;
  try {
    await fastify.knex.raw("INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)", [user_id, product_id, quantity]);
    return reply.send({ message: "Produk ditambahkan ke keranjang!" });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal menambahkan produk" });
  }
});

fastify.put("/cart/:id", async (request, reply) => {
  const { id } = request.params;
  const { quantity } = request.body;
  try {
    await fastify.knex.raw("UPDATE carts SET quantity = ? WHERE id = ?", [quantity, id]);
    return reply.send({ message: "Jumlah produk diperbarui!" });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal memperbarui jumlah produk" });
  }
});

fastify.delete("/cart/:id", async (request, reply) => {
  const { id } = request.params;
  try {
    await fastify.knex.raw("DELETE FROM carts WHERE id = ?", [id]);
    return reply.send({ message: "Produk dihapus dari keranjang!" });
  } catch (error) {
    return reply.code(500).send({ error: "Gagal menghapus produk dari keranjang" });
  }
});

fastify.ready().then(importProducts);

fastify.listen({ port: 5000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});