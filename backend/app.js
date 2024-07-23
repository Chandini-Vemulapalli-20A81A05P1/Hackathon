import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors package
import express from 'express';
import connection from './DBConnection.js';

const app = express();
const port = 5000;

// CORS Middleware
app.use(cors()); // Enable CORS for all origins

// Body Parser Middleware
app.use(bodyParser.json());

// Route to handle user signup
app.post('/signup', async (req, res) => {
    const { firstName, lastName, PhoneNumber, Gender, Age, Department, Supervisor, UserName, Password, Role } = req.body;
   console.log(firstName);
    // Check if user already exists
    connection.query('SELECT * FROM Employee WHERE UserName = ?', [UserName], async (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Failed to register user' });
      }
  
      if (results.length > 0) {
        // User already exists
        console.log("Username already exists!");
        return res.status(409).json({ message: 'Username already exists!' });
      } else {
        // Insert user into database
   
        const hashpassword = Password;
  
        if (Role === "Supervisor") {
          connection.query(
            'INSERT INTO Employee (FirstName, LastName, PhoneNumber, Gender, Age, Department, UserName, Password, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, PhoneNumber, Gender, Age, Department, UserName, hashpassword, Role],
            (error, results) => {
              if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ message: 'Failed to register user' });
              }
  
              console.log('User registered:', results);
              res.status(201).json({ message: 'User registered successfully' });
            }
          );
        } else {
          connection.query(
            'INSERT INTO Employee (FirstName, LastName, PhoneNumber, Gender, Age, Department, Supervisor, UserName, Password, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, PhoneNumber, Gender, Age, Department, Supervisor, UserName, hashpassword, Role],
            (error, results) => {
              if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ message: 'Failed to register user' });
              }
  
              console.log('User registered:', results);
              res.status(201).json({ message: 'User registered successfully' });
            }
          );
        }
      }
    });
  });
app.post('/login', (req, res) => {
    console.log("hello");
    const { UserName, Password } = req.body;

    if (!UserName || !Password) {
        return res.status(400).json({ message: 'Username and Password are required' });
    }
    
    // Check if user exists and password matches
    connection.query('SELECT * FROM Employee WHERE UserName = ? AND Password = ?', [UserName, Password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Failed to login' });
        }

        if (results.length > 0) {
            // User found and authenticated
            console.log('User authenticated successfully');
            res.status(200).json({ message: 'Login successful', user: results[0] });
        } else {
            // User not found or password incorrect
            console.log('Invalid username or password');
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});
app.post('/tasks/:taskId/approve', async (req, res) => {
  const { taskId } = req.params;

  try {
    // Update task status in the database
    const query = 'UPDATE Tasks SET Task_Status = ? WHERE Task_Id = ? AND Task_Status = ?';
    connection.query(query, ['Approved', taskId, 'Waiting For approval'], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).send('Error approving task');
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        return res.status(404).send('Task not found or already approved');
      }

      res.status(200).send('Task status updated to Approved');
    });
  } catch (error) {
    console.error('Error approving task:', error);
    res.status(500).send('Error approving task');
  }
});
app.post("/TaskSubmission", (req, res) => {
    const { Task_Name, Task_Description, Assigned_By, Assigned_TO, Start_Date, Due_Hours } = req.body;
  
    const query = 'INSERT INTO Tasks (Task_Name, Task_Description, Assigned_By, Assigned_TO, Start_Date, Due_Hours) VALUES (?, ?, ?, ?, ?, ?)';
  
    connection.query(query, [Task_Name, Task_Description, Assigned_By, Assigned_TO, Start_Date, Due_Hours], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Failed to assign task' });
      }
  
      res.status(201).json({ message: 'Task Assigned successfully' }); // 201 Created status code
    });
  });
  app.get('/tasks', (req, res) => {
    const query = 'SELECT * FROM Tasks';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ message: 'Failed to fetch tasks' });
      }
  
      res.status(200).json(results);
    });
  });
  
  app.post("/request",(req,res)=>{
    console.log("klsgnjkd");
    const {Req_name,Req_Description,Req_From, Req_To}=req.body;
    connection.query('INSERT INTO Request ( Req_name, Req_Description, Req_From, Req_To) VALUES (?, ?, ?, ?)',
    [Req_name,Req_Description,Req_From, Req_To], (error, results) => {
    if (error) {
    console.error('Error executing query:', error);
    return res.status(500).json({ message: 'Failed to sent request!' });
    }
    res.status(201).json({ message: 'Request Submitted successfully' }); // 201 Created status code
    });
    
    })
app.get('/ratings_fetch', (req, res) => {
    // Check if user already exists
    connection.query('SELECT * from Rating', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Failed to fetch data' });
        }

        res.status(200).json(results); // Send the results as JSON
    });
});

// Logout route
app.post('/logout', (req, res) => {
res.clearCookie('authToken'); // Clear the authentication token cookie
res.status(200).json({ message: 'Logout successful' });
});

app.post('/Task_status', (req, res) => {
    const { Task_Id } = req.body;
     console.log(Task_Id);
    // Check if user already exists
    connection.query('Update Tasks set Task_Status = "Waiting for approval" where Task_Id  = ? and Task_Status = "Pending"', [Task_Id], async (error, results) => 
        {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Failed to register user' });
        }
        return res.status(200).json({ message: 'successfully changed task state! ' });


    });
});
app.post('/rating_insert', (req, res) => {
    
    const { rating,Review } = req.body;
       console.log(rating);
    connection.query('Insert into Rating(Emp_Id, rating,Review) values(?, ?,?)',[1,rating,Review],
        (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(500).json({ message: 'Failed to insert the rating' });
            }
            return res.status(200).json({ message: 'successfully inserting the rating to the task ' });
});
})

app.get('/employee_fetch',  (req, res) => {
 
    connection.query('SELECT * FROM Employee where Role="Employee"',  (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Failed to get Employees under the supervisor!' });
        }
       return  res.status(200).json({ message: 'Employees fetched successfully', requests: results }); // 200 OK status code
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http:172.18.0.1//:${port}`);
});
