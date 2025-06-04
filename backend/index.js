require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

const teacherRoutes = require('./src/route/teacherRoute');
app.use('/teacher', teacherRoutes);

const studentRoutes = require('./src/route/studentRoute');
app.use('/student', studentRoutes);

const userRoutes = require('./src/route/userRoute');
app.use('/user', userRoutes);

const projectRoutes = require('./src/route/projectRoute');
app.use('/project', projectRoutes);

const project1Routes = require('./src/route/project1Route');
app.use('/project1', project1Routes);

const project2Routes = require('./src/route/project2Route');
app.use('/project2', project2Routes);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})