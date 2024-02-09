const express = require('express');
const app = express();

const PORT = 3000;

app.get("/static", function(_, response){
  const responseData = {
      header: "Hello",
      body: "Octagon NodeJS Test"
  };
  response.json(responseData);
});

app.get("/dynamic", function(request, response){
  const a = parseInt(request.query.a);
  const b = parseInt(request.query.b);
  const c = parseInt(request.query.c);
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    const errorResponse = {
        header: "Error"
    };
    response.json(errorResponse);
  } else {
    const result = (a * b * c) / 3;
    const responseData = {
        header: "Calculated",
        body: result
    };
  response.json(responseData);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
