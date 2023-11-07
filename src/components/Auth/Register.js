import React from 'react';
import { Container, Card, CardContent, TextField, Stack, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { Link } from "react-router-dom"
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FormControl } from '@mui/base';
import SelectAutoWidth from './SelectAutoWidth.js';
import Swal from 'sweetalert2';

export default function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      image: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Required").min(2, "Must be 2 characters or more"),
      email: Yup.string().required("Required").email("Invalid email"),
      image: Yup.string().required("Required").url("Invalid url"),
      password: Yup.string().required("Required").min(6, "Must be 6 characters or more")
    }),
    onSubmit: (values) => {
      registerUser(values);
    }
  });

  const registerUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Registration successful
        Swal.fire({
          title: "Registration successful",
          icon: "success"
        });
        navigate("/login")
      } else {
        // Handle registration error
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: errorData.message,
        });
      }
    } catch (error) {
      // Handle any other error occurred during registration
      Swal.fire({
        icon: "error",
        title: error.message,
      });
    }
  };

  return (
    <Container>
      <div style={{
        width: '500px', display: 'flex', flexDirection: 'column',
        margin: '0 auto', paddingTop: '50px'
      }}>
        {/* <Card style={{ width: '100%', maxWidth: '500px' }}>
          <CardContent>
            <h4>Register</h4>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                id="fullName"
                label="Full Name"
                fullWidth
                margin="normal"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                helperText={formik.touched.fullName && formik.errors.fullName}
              />
              <TextField
                id="email"
                label="Email"
                fullWidth
                margin="normal"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                id="image"
                label="Image"
                fullWidth
                margin="normal"
                name="image"
                value={formik.values.image}
                onChange={formik.handleChange}
                error={formik.touched.image && Boolean(formik.errors.image)}
                helperText={formik.touched.image && formik.errors.image}
              />
              <TextField
                id="password"
                label="Password"
                fullWidth
                margin="normal"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                <Button variant="contained" color="primary" type="submit">
                  Register
                </Button>
              </div>
            </form>
          </CardContent>
        </Card> */}

        {/*  */}
        <React.Fragment>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Get started absolutely free.</p>
            <p style={{ fontSize: '16px', color: '#637381' }}>Free forever. No credit card needed.</p>
          </div>
          <form onSubmit={formik.handleSubmit} action={<Link to="/login" />}>


            <TextField
              variant='outlined'
              color='secondary'
              required
              sx={{ mb: 1 }}

              id="fullName"
              label="Full Name"
              fullWidth
              margin="normal"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
            <TextField
              variant='outlined'
              color='secondary'
              required
              sx={{ mb: 1 }}

              id="email"
              label="Email"
              fullWidth
              margin="normal"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              variant='outlined'
              color='secondary'
              required
              sx={{ mb: 2 }}

              id="image"
              label="Image"
              fullWidth
              margin="normal"
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
            />

            {/* <FormControl sx={{mb: 2}}>
<InputLabel id="role">Role</InputLabel>
  <Select fullWidth
    labelId="demo-simple-select-label"
    id="role"
    value={formik.values.role}
    label="Role"
    onChange={formik.handleChange}
    placeholder='Role'
  >
    <MenuItem role={1}>Provider</MenuItem>
    <MenuItem role={2}>Customer</MenuItem>
  </Select>
  </FormControl> */}

            <SelectAutoWidth />

            <TextField
              variant='outlined'
              color='secondary'
              required
              sx={{ mb: 2 }}

              id="password"
              label="Password"
              fullWidth
              margin="normal"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Button sx={{ mb: 4 }}
              fullWidth style={{
                backgroundColor: "#6DABB4", color: 'white',
                border: 'none', padding: '0.8rem', borderRadius: '0.4rem',
              }}
              variant="contained" type="submit">Sign up </Button>
          </form>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <small style={{ fontWeight: 'bold' }}>
              Already have an account? <> </>
              <Link to="/login" style={{ color: '#6DABB4', textDecoration: 'none' }}>Login</Link>
            </small>

            <small style={{ fontWeight: 'bold' }}>
              <Link to="/" style={{ color: '#6DABB4', textDecoration: 'none' }}>Back to Home</Link>
            </small>
          </div>

        </React.Fragment>
        {/*  */}
      </div>
    </Container>
  );
}
