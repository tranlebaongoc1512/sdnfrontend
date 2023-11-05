import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { DataGrid, GridActionsCellItem, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

export default function BookingManagement() {
  const { token } = useContext(AuthContext);
  const [booking, setBookingData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/booking', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBookingData(data.bookings);
        } else {
          // Handle error response
          const errorData = await response.json();
          alert(errorData.message);
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchBookingData();
  }, [token]);

  const columns = [
    { field: 'classId', headerName: 'Class ID', width: 100, renderCell: (params) => params.row.classId },
    { field: 'teacherId', headerName: 'Teacher ID', width: 150, renderCell: (params) => params.row.teacherId },
    { field: 'userId', headerName: 'Member ID', width: 180, renderCell: (params) => params.row.userId },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            component={Link}
            to={`/mangagement/booking/update/${params.row.id}`}
          />
        </div>
      ),
    },
  ];
  if (booking.length === 0) {
    return (
      <div>
        <Button variant="outlined" component={Link} to="/mangagement/booking/add" style={{ margin: '10px 0 5px 0', backgroundColor: 'white', borderColor: '#6DABB4', color: 'black' }}>
          + Add booking
        </Button>
        <p>No bookings available.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
      <Button variant="outlined" component={Link} to="/mangagement/booking/add" style={{ margin: '10px 0 5px 0', backgroundColor: 'white', borderColor: '#6DABB4', color: 'black' }}>+ Add booking</Button>
      <DataGrid
        rows={booking}
        columns={columns}
        editMode="row"
        getRowId={(row) => row._id}
        components={{
          Toolbar: GridToolbarContainer,
          ToolbarExport: GridToolbarExport,
        }}
        sx={{ backgroundColor: 'white' }}
      />
    </div>
  );
}
