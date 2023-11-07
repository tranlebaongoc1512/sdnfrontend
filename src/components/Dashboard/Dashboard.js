import React, { useContext, useEffect, useState } from 'react';
import { Backdrop, Box, Button, Container, Fade, Grid, MenuItem, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';
import styles from './dashboard.module.css'
import Navigation from '../Navigation/Navigation';
import FooterComponent from '../Footer/Footer';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const [bookings, setBookingsData] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [bookingId, setBookingId] = useState(null);
    // Số liệu mẫu cho 4 ô trên
    const data = {
        bookingsCompleted: 100,
        bookingsCanceled: 20,
        bookingsFinished: 80,
        bookingsReported: 5,
    };

    useEffect(() => {
        fetchBookingsData()
    }, [])
    const fetchBookingsByStatus = async (status) => {
        try {
            const response = await fetch(`http://localhost:8000/api/booking/listByStatus/${status}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setBookingsData(data.bookings);
            } else {
                // Handle error response
                const errorData = await response.json();
                Swal.fire({
                    icon: "error",
                    title: errorData.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: error.message,
            });
        }
    }
    const fetchBookingsData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/booking/listAll', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setBookingsData(data.bookings);
            } else {
                // Handle error response
                const errorData = await response.json();
                Swal.fire({
                    icon: "error",
                    title: errorData.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: error.message,
            });
        }
    };
    const fetchBookingData = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/booking/bookingDetails/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setBookingData(data.booking);
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: "error",
                    title: errorData.message,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: error.message,
            });
            setOpen(false);
        }
    };
    const editBooking = (id) => {
        setBookingId(id)
        fetchBookingData(id);
        setOpen(true);
    };
    const handleChangeStatus = async (e) => {
        try {
            const response = await fetch(`http://localhost:8000/api/booking/updateStatus/${bookingId}`, {
                method: 'PUT',
                body: JSON.stringify({ status: e.target.value }),
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                fetchBookingsData()
            } else {
                // Handle error response
                const errorData = await response.json();
                console.log(errorData.message)
            }
        } catch (error) {
            console.log(error.message)
        }
    };
    const columns = [
        { field: 'id', headerName: 'ID', width: 40, renderCell: (params) => params.row.id },
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: (params) => params.row.name
        },
        {
            field: 'user',
            headerName: 'User',
            width: 200,
            renderCell: (params) => params.row.user
        },
        {
            field: 'datetime',
            headerName: 'Datetime',
            width: 200,
            renderCell: (params) => params.row.datetime
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            renderCell: (params) => params.row.status
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
                        onClick={() => editBooking(params.row.id)}
                    />
                </div>
            ),
        },
    ];
    const rows = bookings

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsData()} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Typography variant="h6">All Bookings</Typography>
                                <Typography variant="h4">{data.bookingsCompleted}</Typography>
                            </button>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsByStatus('canceled')} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <img src="./assets/img/cancel.png" alt="canceled" className={styles.image} />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h6">Bookings Canceled</Typography>
                                        <Typography variant="h4">{data.bookingsCanceled}</Typography>
                                    </Grid>
                                </Grid>
                            </button>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsByStatus('completed')} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <img src="./assets/img/finished.png" alt="completed" className={styles.image} />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h6">Bookings Completed</Typography>
                                        <Typography variant="h4">{data.bookingsFinished}</Typography>
                                    </Grid>
                                </Grid>
                            </button>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsByStatus('reported')} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <img src="./assets/img/reported.png" alt="reported" className={styles.image} />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h6">Bookings Reported</Typography>
                                        <Typography variant="h4">{data.bookingsReported}</Typography>
                                    </Grid>
                                </Grid>
                            </button>
                        </Paper>
                    </Grid>
                    {/* Bảng lịch sử dịch vụ */}
                    <Grid item xs={12}>
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
                    </Grid>
                </Grid>
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
                            <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>Update Booking</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography>Service Name: {bookingData?.serviceId.name}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>Customer Name: {bookingData?.customerId.fullName}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>Date and Time: {bookingData?.datetime}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>Address: {bookingData?.address}</Typography>
                                </Grid>
                            </Grid>
                            <TextField
                                id="status"
                                label="Status"
                                select
                                fullWidth
                                margin="normal"
                                name="status"
                                onChange={handleChangeStatus}
                            >
                                <MenuItem value='pending'>
                                    Pending
                                </MenuItem>
                                <MenuItem value='confirmed'>
                                    Confirmed
                                </MenuItem>
                                <MenuItem value='completed'>
                                    Completed
                                </MenuItem>
                                <MenuItem value='cancel'>
                                    Cancel
                                </MenuItem>
                            </TextField>
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <FooterComponent />
        </>

    );
};

export default Dashboard;
