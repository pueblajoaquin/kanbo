const express = require("express");
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.status(200).json({ message: "Kanbo API is running" });
});

app.listen(port,()=>{
console.log(`Server is runing in port ${port}`);
});

