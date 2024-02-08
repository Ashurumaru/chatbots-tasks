const express = require('express');
const app = express();

const PORT = 3000;

app.get("/", function(request, response){
    response.send('<h1>Привет, Октагон!</h1>');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
