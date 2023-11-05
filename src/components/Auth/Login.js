import React, { useContext } from 'react';
import { Container, Card, CardContent, TextField, Stack, Button} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from "react-router-dom"

import { AuthContext } from '../../context/AuthContext'; // Import the AuthContext
import { textAlign } from '@mui/system';

export default function Login() {
  const { login } = useContext(AuthContext); // Access the login function from AuthContext

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Required').email('Invalid email'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      login(values.email, values.password);
    },
  });

  return (
    <Container>
      <div 
      style={{ width:'500px', display: 'flex', flexDirection: 'column', 
                margin: '0 auto', paddingTop: '120px'}}
      >
        {/* <Card style={{ width: '100%', maxWidth: '500px' }}>
        
          <CardContent>
            <h4>Login</h4>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                id="email"
                label="Email"
                fullWidth
                margin="normal"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
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
                error={formik.touched.password && formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />

              <Button variant="contained" color="primary" type="submit">
                Login
              </Button>
            </form>
          </CardContent>

        </Card> */}

 {/* Test */}
      <React.Fragment>
        <div style={{textAlign: 'left'}}>
            <p style={{fontSize:'24px', fontWeight:'bold'}}>Sign in</p>
            <p style={{fontSize:'16px', color:'#637381'}}>Enter your details below</p>
          </div>
            <form onSubmit={formik.handleSubmit} action={<Link to="/login" />}>


            <TextField
                id="email "
                label="Email Address"

                fullWidth
                margin="normal"
                name="email"
                    
                type="email"
                    variant='outlined'
                    color='secondary'
                    required
                    sx={{mb: 1}}

                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
              />
            <TextField

                    variant='outlined'
                    color='secondary'
                    required
                    sx={{mb: 2}}
                id="password"
                label="Password"
                fullWidth
                margin="normal"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />

                <Button  sx={{mb: 4}}
                fullWidth variant="outlined" style={{backgroundColor:"#6DABB4", color:'white', 
                border: 'none', padding: '0.8rem', borderRadius:'0.4rem',}} 
                                                      type="submit">Login</Button>
            </form>
            <div style={{display:'flex', justifyContent:'space-between'}}>
            <small style={{ fontWeight:'bold'}}>
              Don’t have an account?<> </>
              <Link to="/register" style={{color:'#6DABB4', textDecoration:'none'}}>Get started</Link>
            </small>

            <small style={{ fontWeight:'bold'}}>
              <Link to="/" style={{color:'#6DABB4', textDecoration:'none'}}>Back to Home</Link>
            </small>
            </div>
     
        </React.Fragment>
        </div>

    </Container>

    
  );
}
