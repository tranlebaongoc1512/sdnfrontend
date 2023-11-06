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
    console.log(token)
    const [bookings, setBookingsData] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [isFetchBookingData, setIsFetchBookingData] = useState(false);
    const [bookingId, setBookingId] = useState(null);
    // Số liệu mẫu cho 4 ô trên
    const data = {
        bookingsCompleted: 100,
        bookingsCanceled: 20,
        bookingsFinished: 80,
        bookingsReported: 5,
    };

    // Dữ liệu lịch sử dịch vụ mẫu
    const bookingHistory = [
        { id: 1, name: 'Booking A', user: '1', status: 'Completed', date: '2023-11-01', time: '19:00' },
        { id: 2, name: 'Booking B', user: '2', status: 'Canceled', date: '2023-11-02', time: '19:00' },
        { id: 3, name: 'Booking C', user: '3', status: 'Finished', date: '2023-11-03', time: '19:00' },
        { id: 4, name: 'Booking D', user: '4', status: 'Reported', date: '2023-11-04', time: '19:00' },
    ];
    useEffect(() => {
        fetchBookingsData(token)
    }, [])
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
                setBookingsData(data);
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
            const response = await fetch(`http://localhost:8000/api/booking/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setBookingData(data);
                setIsFetchBookingData(true);
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
            field: 'date',
            headerName: 'Date',
            width: 140,
            renderCell: (params) => params.row.date
        },
        {
            field: 'time',
            headerName: 'Time',
            width: 140,
            renderCell: (params) => params.row.time
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
    const rows = bookingHistory

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <Grid container spacing={3}>
                    <Grid item xs={3}>
                        <Paper className={styles.paper}>
                            <Typography variant="h6">All Bookings</Typography>
                            <Typography variant="h4">{data.bookingsCompleted}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={styles.paper}>
                            <Grid container>
                                <Grid item xs={3}>
                                    <img src="./assets/img/cancel.png" alt="canceled" className={styles.image} />
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="h6">Bookings Canceled</Typography>
                                    <Typography variant="h4">{data.bookingsCanceled}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={styles.paper}>
                            <Grid container>
                                <Grid item xs={3}>
                                    <img src="./assets/img/finished.png" alt="finished" className={styles.image} />
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="h6">Bookings Finished</Typography>
                                    <Typography variant="h4">{data.bookingsFinished}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={styles.paper}>
                            <Grid container>
                                <Grid item xs={3}>
                                    <img src="./assets/img/reported.png" alt="reported" className={styles.image} />
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="h6">Bookings Reported</Typography>
                                    <Typography variant="h4">{data.bookingsReported}</Typography>
                                </Grid>
                            </Grid>
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
                                    <Typography>Service Name: Service A</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>Customer Name: John Doe</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>Date and Time: 2023-11-05 10:00 AM</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>Address: 123 Main St, City</Typography>
                                </Grid>
                            </Grid>
                            <TextField
                                id="status"
                                label="Status"
                                select
                                fullWidth
                                margin="normal"
                                name="status"
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
                            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained"  color="primary">Submit</Button>
                                <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen(false)}>Cancel</Button>
                            </div>
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <FooterComponent />
        </>

    );
};

export default Dashboard;
