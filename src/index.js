const express = require("express");
const prisma = require("./prisma.js");

const app = express();
const port = 3000;


app.get('/', async (req, res) => {

  const users = await prisma.user.findMany();

  res.status(200).json({ message: "Kanbo API is running", users });
});

app.listen(port,()=>{
console.log(`Server is runing in port http://localhost:${port}`);
});

