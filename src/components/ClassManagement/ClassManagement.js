import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Backdrop, Box, Button, Fade, Modal, TextField, Typography, MenuItem } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarExport,
} from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';


export default function ClassManagement() {
  const { token } = useContext(AuthContext);
  const [classes, setClassesData] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [teacherList, setTeacherList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [classData, setClassData] = useState(null);
  const [isFetchClassData, setIsFetchClassData] = useState(false);
  const [classId, setClassId] = useState(null);

  useEffect(() => {
    fetchClassesData(token)
  }, [])
  const fetchClassesData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/class', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClassesData(data);
      } else {
        // Handle error response
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const fetchClassData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/class/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setClassData(data);
        setIsFetchClassData(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching class data.');
      setOpen(false);
    }
  };
  const fetchTeachersList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/teacher', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTeacherList(data);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching teacher data.');
      setOpen(false);
    }
  };
  const addClass = () => {
    fetchTeachersList();
    setIsEditMode(false);
    setClassId(null);
    setOpen(true)
  };
  const editClass = (id) => {
    setIsEditMode(true);
    fetchTeachersList();
    setClassId(id)
    fetchClassData(id);
    setOpen(true);
  };
  useEffect(() => {
    if (isFetchClassData) {
      formik.setValues({
        name: classData.name,
        type: classData.type,
        classSize: classData.classSize,
        time: classData.time,
        date: classData.date,
        image: classData.image,
        teacherId: classData.teacherId,
      });
    }
  }, [isFetchClassData, classData]);
  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      classSize: '',
      time: '',
      date: '',
      image: '',
      teacherId: '',
    },
    onSubmit: async (values) => {
      if (isEditMode) {
        try {
          const response = await fetch(`http://localhost:8000/api/class/management/${classId}`, {
            method: 'PUT',
            body: JSON.stringify(values),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            alert('Class updated successfully');
            formik.resetForm();
            fetchClassesData(token)
            setOpen(false);
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
          }
        } catch (error) {
          console.error(error);
          alert('An error occurred while updating the class.');
        }
      } else {
        try {
          // Convert date to the required format MM-dd-yyyy
          const formattedDate = new Date(values.date).toLocaleDateString('en-US');

          const response = await fetch('http://localhost:8000/api/class/management', {
            method: 'POST',
            body: JSON.stringify({ ...values, date: formattedDate }), // Use the formatted date
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            alert('Class added successfully');
            formik.resetForm();
            setOpen(false);
            fetchClassesData(token)
          } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
          }
        } catch (error) {
          console.error(error);
          alert('An error occurred while adding the class.');
        }
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required.'),
      type: Yup.string().required('Required.'),
      classSize: Yup.number().required('Required.').integer().min(1, 'Must be at least 1'),
      time: Yup.string().required('Required.').matches(/^\d{2}:\d{2}\s?-\s?\d{2}:\d{2}$/, 'Invalid time format (HH:mm - HH:mm)'),
      date: Yup.string()
        .required('Required.')
        .test('valid-date', 'Invalid date format (MM-dd-yyyy)', (value) => {
          if (!value) return true;
          const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
          return dateRegex.test(value);
        }),
      image: Yup.string().required('Required.').url('Invalid URL format'),
      teacherId: Yup.string().required('Required.'),
    }),
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 40, renderCell: (params) => params.row.id },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <div>
          <Avatar alt={params.row.id} src={params.row.image} />
        </div>
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => params.row.name
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
      renderCell: (params) => params.row.type
    },
    {
      field: 'classSize',
      headerName: 'Class Size',
      width: 110,
      renderCell: (params) => params.row.classSize
    },
    {
      field: 'slotLeft',
      headerName: 'Slot left',
      width: 110,
      renderCell: (params) => params.row.slotLeft
    },
    {
      field: 'time',
      headerName: 'Time',
      width: 140,
      renderCell: (params) => params.row.time
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 140,
      renderCell: (params) => params.row.date
    },
    {
      field: 'teacherId',
      headerName: 'Teacher ID',
      width: 100,
      renderCell: (params) => params.row.teacherId
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <div>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => editClass(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const rows = classes

  return (
    <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
      <Button variant="outlined" onClick={() => addClass()} sx={{ margin: '10px 0 5px 0', backgroundColor: 'white', borderColor: '#6DABB4', color: 'black' }}>+ Add class</Button>
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
            <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>{isEditMode ? 'Update Class' : 'Add Class'}</Typography>
            <TextField
              id="name"
              label="Class Name"
              fullWidth
              margin="normal"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              id="type"
              label="Type"
              fullWidth
              margin="normal"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              error={formik.touched.type && formik.errors.type}
              helperText={formik.touched.type && formik.errors.type}
            />
            <TextField
              id="classSize"
              label="Class Size"
              type="number"
              fullWidth
              margin="normal"
              name="classSize"
              value={formik.values.classSize}
              onChange={formik.handleChange}
              error={formik.touched.classSize && formik.errors.classSize}
              helperText={formik.touched.classSize && formik.errors.classSize}
            />
            <TextField
              id="time"
              label="Time"
              fullWidth
              margin="normal"
              name="time"
              value={formik.values.time}
              onChange={formik.handleChange}
              error={formik.touched.time && formik.errors.time}
              helperText={formik.touched.time && formik.errors.time}
            />
            <TextField
              id="date"
              label="date"
              fullWidth
              margin="normal"
              name="date"
              value={formik.values.date.replace(/^(\d)\/(\d)\/(\d{4})$/, '0$1-0$2-$3')
                .replace(/^(\d{2})\/(\d)\/(\d{4})$/, '$1-0$2-$3')
                .replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$1-$2-$3')}
              onChange={formik.handleChange}
              error={formik.touched.date && formik.errors.date}
              helperText={formik.touched.date && formik.errors.date}
            />
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

            {/* Teacher selection dropdown */}
            <TextField
              id="teacherId"
              label="Teacher"
              select
              fullWidth
              margin="normal"
              name="teacherId"
              value={formik.values.teacherId}
              onChange={formik.handleChange}
              error={formik.touched.teacherId && formik.errors.teacherId}
              helperText={formik.touched.teacherId && formik.errors.teacherId}
            >
              {teacherList.map((teacher) => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {`${teacher.id} - ${teacher.fullName}`}
                </MenuItem>
              ))}
            </TextField>
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