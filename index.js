const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 8081;
const cors = require('cors');
app.use(cors());
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB Atlas cluster using connection string

mongoose.connect('mongodb+srv://expertacademyorai:expertacademy%40rashid@expertcluster.zjafyw9.mongodb.net/rashidres?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas cluster');
});

// Define student schema
const studentSchema = new mongoose.Schema({
  id: String,
  roll_number: String,
  name: String,
  fathers_name: String,
  documents_link: String
});
const Student = mongoose.model('Student', studentSchema);

// GET endpoint to retrieve all student records
app.get('/rashidstudents', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving students');
  }
});

// POST endpoint to create a new student record
// POST endpoint to create a new student record
app.post('/rashidstudents', async (req, res) => {
    const newStudent = new Student(req.body);
    try {
      await newStudent.save();
      console.log("res, ==> ", res);
      console.log("req, ==> ", req)
      console.log(newStudent); // log the new student object to the console
      res.json(newStudent);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating student');
    }
  });
// GET endpoint to retrieve a single student record by ID
app.get('/rashidstudents/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving student');
  }
});

  // DELETE endpoint to delete a student record by ID
  app.delete('/rashidstudents/:id', async (req, res) => {
    try {
      const deletedStudent = await Student.findByIdAndDelete(req.params.id);
      if (!deletedStudent) {
        return res.status(404).send('Student not found');
      }
      res.json(deletedStudent);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting student');
    }
  });

  // PUT endpoint to update a student record by ID
app.put('/rashidstudents/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log(updatedStudent)
    if (!updatedStudent) {
      return res.status(404).send('Student not found');
    }
    res.json(updatedStudent);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating student');
  }
});
  

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
