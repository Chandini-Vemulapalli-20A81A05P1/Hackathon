import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import the cors package
import express from 'express';
import jwt from 'jsonwebtoken';
import connection from './DBConnection.js';
const app = express();
const port = 5002;

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
   
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(Password, salt);
  
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
  const JWT_SECRET = 'jdhgkjdhskvdskhvhkdgsvhdahkgv'; 
  app.post('/login', (req, res) => {
    const { UserName, Password } = req.body;

    if (!UserName || !Password) {
        return res.status(400).json({ message: 'UserName and Password are required' });
    }

    connection.query('SELECT * FROM Employee WHERE UserName = ?', [UserName], async (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Failed to login' });
        }

        if (results.length > 0) {
            const user = results[0];
            // Compare the provided password with the hashed password stored in the database
            const isMatch = await bcrypt.compare(Password, user.Password);

            if (isMatch) {
                // Generate JWT token
                const token = jwt.sign({ id: user.id, UserName: user.UserName }, JWT_SECRET, { expiresIn: '1h' });
                // Set token in cookie
                res.cookie('authToken', token, { httpOnly: true, secure: false }); // Set secure to true if using HTTPS
                return res.status(200).json({
                  message: 'Login successful',
                  user: {
                    Emp_Id: user.ID,
                    UserName: user.UserName,
                    Role: user.Role,
                    token: token
                  }
                });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});
// Example Node.js Express backend
app.post('/tasks/:taskId/complete', (req, res) => {
  const { taskId } = req.params;

  const query = 'UPDATE Tasks SET Task_Status = ? WHERE Task_Id = ?';
  connection.query(query, ['Waiting For Approval', taskId], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Error updating task status');
    }
    res.status(200).send('Task status updated to Waiting For Approval');
  });
});
// const authenticateToken = (req, res, next) => {
//   const token = req.cookies.authToken;
  
//   if (!token) return res.status(401).json({ message: 'Access denied' });
  
//   jwt.verify(token, JWT_SECRET, (err, user) => {
//   if (err) return res.status(403).json({ message: 'Invalid token' });
//   req.user = user; // Attach user info to request object
//   next();
//   });
//   };
app.post('/tasks/:taskId/approve', (req, res) => {
  const { taskId } = req.params;

  const query = 'UPDATE Tasks SET Task_Status = ? WHERE Task_Id = ? AND Task_Status = ?';
  connection.query(query, ['Approved', taskId, 'Waiting For Approval'], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).send('Error approving task');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Task not found or already approved');
    }
    res.status(200).send('Task status updated to Approved');
  });
});
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    req.user = decoded; // Store the decoded token payload in req.user
    next();
  });
};

// Endpoint to get average rating
app.get('/gettingrating', authenticateJWT, (req, res) => {
  const { userid } = req.query; // Retrieve userid from query parameters
  console.log("hello");
  console.log(userid);

  connection.query('SELECT AVG(Rating) as avgRating, Review FROM Rating WHERE Emp_Id = ?', [userid], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ message: 'Failed to get Employee rating!' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this employee!' });
    }
    res.status(200).json({ avgRating: results[0].avgRating });
  });
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
// app.get('/ratings_fetch', (req, res) => {
//     // Check if user already exists
//     connection.query('SELECT * from Rating', (error, results) => {
//         if (error) {
//             console.error('Error executing query:', error);
//             return res.status(500).json({ message: 'Failed to fetch data' });
//         }

//         res.status(200).json(results); // Send the results as JSON
//     });
// });

// Logout route
app.post('/logout', (req, res) => {
res.clearCookie('authToken'); // Clear the authentication token cookie
res.status(200).json({ message: 'Logout successful' });
});

app.post('/rating_insert', (req, res) => {
  const { rating, review, Emp_Id} = req.body;
  const query = 'INSERT INTO Rating (rating, review, Emp_Id) VALUES (?, ?, ?)';
  connection.query(query, [rating, review, Emp_Id], (error, results) => {
    if (error) {
      console.error('Error inserting rating:', error);
      return res.status(500).send('Error inserting rating');
    }
    res.status(200).send('Rating inserted successfully');
  });
});
// app.get('/ratings_fetch', (req, res) => {
//   const { Emp_Id } = req.query;
//   const query = 'SELECT rating, review FROM Rating WHERE Emp_Id = ?';
//   connection.query(query, [Emp_Id], (error, results) => {
//     if (error) {
//       console.error('Error fetching ratings:', error);
//       return res.status(500).send('Error fetching ratings');
//     }
//     res.status(200).json(results);
//   });
// });
app.get('/employee_fetch',  (req, res) => {
 
    connection.query('SELECT * FROM Employee where Role="Employee"',  (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ message: 'Failed to get Employees under the supervisor!' });
        }
       return  res.status(200).json({ message: 'Employees fetched successfully', requests: results }); // 200 OK status code
    });
});
app.get('/employee_fetch1',  (req, res) => {
  const { userid } = req.query;
  console.log(userid);
  connection.query('SELECT * FROM Employee where Role="Employee" and ID=?',  [userid],(error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          return res.status(500).json({ message: 'Failed to get Employees under the supervisor!' });
      }
      console.log(results);
     return  res.status(200).json({ message: 'Employees fetched successfully', requests: results }); // 200 OK status code
  });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http:172.18.0.1//:${port}`);
});
