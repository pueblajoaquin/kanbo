const express = require("express");
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const { authenticate } = require("./middlewares/authMiddleware");

const app = express();
const port = 3000;


app.use(express.json());
app.use('/auth', authRoutes);

app.use('/users',userRoutes);

app.use('/projects', projectRoutes);

app.listen(port, ()=>{
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});