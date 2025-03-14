require('dotenv').config();


const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;

// SIGNUP
app.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, role = 'user' } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
  }

  const { data: { user }, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    return res.status(500).json({ error: authError.message });
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert([
      {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        role,
      }
    ]);

  if (profileError) {
    return res.status(500).json({ error: profileError.message });
  }

  res.status(201).json({
    message: 'User created and profile added successfully',
    userId: user?.id
  });
});

// SIGNIN
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    res.status(200).json({
      message: 'Login successful',
      user: data?.user,
      access_token: data?.session?.access_token
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// CREATE COURSE
async function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, jwtKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
async function checkRole(req, res, next) {
  const { user } = req;

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.sub)
    .single();

  if (error || !data) {
    return res.status(500).json({ error: 'Profile not found' });
  }

  if (data.role !== 'admin' && data.role !== 'teacher') {
    return res.status(403).json({ error: 'Unauthorized, role must be admin or teacher' });
  }

  next();
}
app.post('/add-course', verifyToken, checkRole, async (req, res) => {
  const { title, description, video_url } = req.body;

  if (!title || !description || !video_url) {
    return res.status(400).json({ error: 'Title, description, and video_url are required' });
  }

  const { data, error } = await supabase
    .from('courses')
    .insert([
      {
        title,
        description,
        video_url,
      }
    ])
    .select('*');

    if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({
    message: 'Course added successfully',
    course: data,
  });
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});