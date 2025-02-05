require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const gadgetRoutes = require('./routes/gadgetRoutes');
const authRoutes = require("./routes/authRoutes");



const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth", authRoutes);
app.use('/gadgets', gadgetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await sequelize.authenticate();
  console.log(`Server running on port ${PORT}`);
});
