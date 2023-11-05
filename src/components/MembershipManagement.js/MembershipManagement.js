import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Backdrop, Box, Button, Fade, Modal, TextField, Typography } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function MembershipManagement() {
  const { token } = useContext(AuthContext);
  const [members, setMembersData] = useState([])
  const [open, setOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const [isFetchMemberData, setIsFetchMemberData] = useState(false);
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    fetchMembersData(token)
  }, [])
  const fetchMembersData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/member', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMembersData(data);
      } else {
        // Handle error response
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const fetchMemberData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/member/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMemberData(data);
        setIsFetchMemberData(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching member data.');
    }
  };
  const addMember = () => {
    setIsEditMode(false);
    setMemberId(null);
    setOpen(true)
  };
  const editMember = (id) => {
    setIsEditMode(true);
    setMemberId(id)
    fetchMemberData(id);
    setOpen(true);
  };
  useEffect(() => {
    if (isFetchMemberData) {
      formik.setValues({
        fullName: memberData.fullName,
        email: memberData.email,
        image: memberData.image,
      });
    }
  }, [isFetchMemberData, memberData]);
  const formik = useFormik({
    initialValues: isEditMode ? {
      fullName: '',
      email: '',
      image: '',
    } : {
      fullName: '',
      email: '',
      password: '',
      image: '',
    },
    onSubmit: async (values) => {
      if (isEditMode) {
        try {
          const response = await fetch(`http://localhost:8000/api/member/management/${memberId}`, {
            method: 'PUT',
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            alert('Member updated successfully');
            formik.resetForm();
            fetchMembersData(token)
            setOpen(false);
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
          }
        } catch (error) {
          console.error(error);
          alert('An error occurred while updating the member.');
        }
      } else {
        try {
          const response = await fetch('http://localhost:8000/api/member/management', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            alert('member added successfully');
            formik.resetForm();
            fetchMembersData(token)
            setOpen(false);
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
          }
        } catch (error) {
          console.error(error);
          alert('An error occurred while adding the member.');
        }
      }
    },
    validationSchema: Yup.object(isEditMode ? {
      fullName: Yup.string().required('Required.'),
      email: Yup.string().email('Invalid email format.').required('Required.'),
      image: Yup.string().required('Required.').url('Invalid URL format'),
    } : {
      fullName: Yup.string().required('Required.'),
      email: Yup.string().email('Invalid email format.').required('Required.'),
      password: Yup.string().required('Required.').min(6, 'Password must be at least 6 characters.'),
      image: Yup.string().required('Required.').url('Invalid URL format'),
    }),
  });


  const columns = [
    { field: 'id', headerName: 'ID', width: 100, renderCell: (params) => params.row.id },
    {
      field: 'image',
      headerName: 'image',
      width: 200,
      renderCell: (params) => (
        <div>
          <Avatar alt={params.row.id} src={params.row.image} />
        </div>
      )
    },
    {
      field: 'fullName',
      headerName: 'fullName',
      width: 280,
      renderCell: (params) => params.row.fullName
    },
    {
      field: 'role',
      headerName: 'role',
      width: 280,
      renderCell: (params) => params.row.role
    },
    {
      field: 'email',
      headerName: 'email',
      width: 240,
      renderCell: (params) => params.row.email
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => editMember(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const rows = members

  return (
    <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
      <Button variant="outlined" onClick={() => addMember()} style={{ margin: '10px 0 5px 0', backgroundColor: 'white', borderColor: '#6DABB4', color: 'black' }}>+ Add member</Button>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        components={{
          Toolbar: GridToolbarContainer,
          ToolbarExport: GridToolbarExport,
        }}
        sx={{ backgroundColor: 'white' }}
      />
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: '10px 10px 5px rgba(0, 0, 0, 50%)',
            borderRadius: '10px',
            p: 4,
          }}>
            <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>{isEditMode ? 'Update Member' : 'Add Member'}</Typography>
            <TextField
              id="fullName"
              label="Full Name"
              fullWidth
              margin="normal"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && formik.errors.fullName}
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
              error={formik.touched.email && formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />
            {!isEditMode && (
              <TextField
                id="password"
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />
            )}
            <TextField
              id="image"
              label="Image URL"
              fullWidth
              margin="normal"
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
              error={formik.touched.image && formik.errors.image}
              helperText={formik.touched.image && formik.errors.image}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
              <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained" onClick={formik.handleSubmit} color="primary">Submit</Button>
              <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}