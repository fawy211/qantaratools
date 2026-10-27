SELECT users.id, users.name, orders.total FROM users INNER JOIN orders ON users.id = orders.user_id WHERE orders.total > 100 ORDER BY orders.total DESC;
