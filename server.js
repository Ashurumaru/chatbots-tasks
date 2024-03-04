const express = require('express');
const mysql = require('mysql2');
const app = express();

const PORT = 3000;
  
const pool = mysql.createPool({
  connectionLimit: 5, 
  host: "localhost",
  user: "root",
  database: "chatbottests",
  password: "BIN!KBK7WVdr/)-t"
});

pool.getConnection((err, _) => {
  if (err) {
    console.error("Ошибка при подключении к базе данных: " + err.message);
    throw err;
  }
  console.log("Подключение к серверу MySQL успешно установлено");
});


app.get("/static", function(_, response){
  const responseData = {
      header: "Hello",
      body: "Octagon NodeJS Test"
  };
  response.json(responseData);
});

app.get("/dynamic", function(request, response){
  const params = ['a', 'b', 'c'];
  for (let i = 0; i < params.length; i++) {
    const currentValue = parseInt(request.query[params[i]]);
    if (isNaN(currentValue)) {
      const errorResponse = {
          header: "Error"
      };
      response.json(errorResponse);
      return;
    }
  }

  const a = parseInt(request.query.a);
  const b = parseInt(request.query.b);
  const c = parseInt(request.query.c);

  const result = (a * b * c) / 3;
  const responseData = {
      header: "Calculated",
      body: result
  };
  response.json(responseData);
});

app.get("/getAllItems", function(_, response) {
  const query = "SELECT * FROM Items";
  pool.query(query, function(err, data) {
    if (err) {
      console.log("Ошибка при получении элементов из таблицы Items: " + err.message);
      response.status(500).send("Internal Server Error");
      return;
    }
    response.json(data);
  });
});

app.get("/addItem", function(request, response){
  const name = request.query.name;
  const desc = request.query.desc;

  if (!name || !desc) {
    response.status(400).json(null);
    return;
  }

  pool.query("INSERT INTO Items (name, description) VALUES (?, ?)", [name, desc], function(err, result){
      if (err) {  
        console.error("Ошибка при добавлении элемента: " + err.message);
        response.status(500).send("Internal Server Error");          
        return;
      }
      response.json({ id: result.insertId, name: name, description: desc });
    });
});

app.get("/deleteItem", function(request, response){
  const id = parseInt(request.query.id);

  if (isNaN(id)) {
    response.status(400).json(null);
    return;
  }

  pool.query("SELECT * FROM Items WHERE id=?", [id], function(err, rows) {
    if (err) {
      console.error("Ошибка при проверке существования элемента: " + err.message);
      response.status(500).send("Internal Server Error");
      return;
    }

    if (rows.length === 0) {
      response.status(404).json({});
      return;
    }

    pool.query("DELETE FROM Items WHERE id=?", [id], function(err, result) {
      if (err) {
        console.error("Ошибка при удалении элемента: " + err.message);
        response.status(500).send("Internal Server Error");
        return;
      }
      response.json({ success: true });
    });
  });
});


app.get("/updateItem", function(request, response){
  const id = parseInt(request.query.id);
  const name = request.query.name;
  const desc = request.query.desc;

  if (isNaN(id) || !name || !desc) {
    response.status(400).json(null);
    return;
  }

  pool.query("SELECT * FROM Items WHERE id=?", [id], function(err, result) {
    
    if (err) {
      console.error("Ошибка при проверке существования элемента: " + err.message);
      response.status(500).send("Internal Server Error");          
      return;
    }
    
    if (result.length === 0) {
      response.status(404).json({});
      return;
    } 
    pool.query("UPDATE Items SET name=?, description=? WHERE id=?", [name, desc, id], function(err, result){
      if (err) {
        console.error("Ошибка при обновлении элемента: " + err.message);
        response.status(500).send("Internal Server Error");          
        return;
      }
      pool.query("SELECT * FROM Items WHERE id=?", [id], function(err, updatedRows) {
        if (err) {
          console.error("Ошибка при получении обновленного элемента: " + err.message);
          response.status(500).send("Internal Server Error");          
          return;
        }
        const updatedItem = updatedRows[0]; 
        response.json(updatedItem); 
      });
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});