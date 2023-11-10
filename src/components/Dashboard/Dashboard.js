import React, { useContext, useEffect, useState } from 'react';
import { Backdrop, Box, Button, Fade, Grid, MenuItem, Modal, Paper, TextField, Typography } from '@mui/material';
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
import dayjs from 'dayjs';

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const [bookings, setBookingsData] = useState([]);

    const [open, setOpen] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [bookingId, setBookingId] = useState(null);
    const [allBookingLengths, setAllBookingLengths] = useState(null)
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
                setAllBookingLengths(data.bookings.length)
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

    useEffect(() => {
        fetchBookingsData();
    }, [])
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
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
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
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: (params) => params.row.serviceId.name
        },
        {
            field: 'user',
            headerName: 'User',
            width: 200,
            renderCell: (params) => params.row.customerId.fullName
        },
        {
            field: 'datetime',
            headerName: 'Datetime',
            width: 200,
            renderCell: (params) => {
                const formatDate = dayjs(params.row.datetime)
                return formatDate.format("DD/MM/YYYY HH:mm:ss")
            }
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
            renderCell: (params) => {
                if (params.row.status !== 'completed') {
                    return (
                        <div>
                            <GridActionsCellItem
                                icon={<EditIcon />}
                                label="Edit"
                                onClick={() => editBooking(params.row._id)}
                            />
                        </div>
                    )
                }
            },
        },
    ];
    const rows = bookings;

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsData()} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Typography variant="h6">All Bookings</Typography>
                                <Typography variant="h4">{allBookingLengths}</Typography>
                            </button>
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsByStatus('pending')} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <img src="./assets/img/pending.png" alt="pending" className={styles.image} />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h6">Bookings Pending</Typography>
                                    </Grid>
                                </Grid>
                            </button>
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsByStatus('confirmed')} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <img src="./assets/img/pending.png" alt="confirmed" className={styles.image} />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h6">Bookings Confirmed</Typography>
                                    </Grid>
                                </Grid>
                            </button>
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsByStatus('completed')} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <img src="./assets/img/completed.png" alt="completed" className={styles.image} />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h6">Bookings Completed</Typography>
                                    </Grid>
                                </Grid>
                            </button>
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsByStatus('canceled')} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <img src="./assets/img/canceled.png" alt="canceled" className={styles.image} />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h6">Bookings Canceled</Typography>
                                    </Grid>
                                </Grid>
                            </button>
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper className={styles.paper}>
                            <button onClick={() => fetchBookingsByStatus('reported')} style={{ width: '100%', background: 'transparent', border: 'none' }}>
                                <Grid container>
                                    <Grid item xs={3}>
                                        <img src="./assets/img/canceled.png" alt="reported" className={styles.image} />
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Typography variant="h6">Bookings Reported</Typography>
                                    </Grid>
                                </Grid>
                            </button>
                        </Paper>
                    </Grid>
                    {/* Bảng lịch sử dịch vụ */}
                    {bookings.length > 0 ? (
                        <Grid item xs={12}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                getRowId={(row) => row._id}
                                editMode="row"
                                components={{
                                    Toolbar: GridToolbarContainer,
                                    ToolbarExport: GridToolbarExport,
                                }}
                                sx={{ backgroundColor: 'white' }}
                            />
                        </Grid>
                    ) : (
                        <div><p>Empty booking list</p></div>
                    )}

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
                                    <Typography>Date and Time booking: {dayjs(bookingData?.datetime).format("DD/MM/YYYY HH:mm:ss")}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography>Address: {bookingData?.address}</Typography>
                                </Grid>
                            </Grid>
                            {bookingData?.status === 'pending' ? (
                                <TextField
                                    label="Status"
                                    select
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChangeStatus}
                                    value={bookingData?.status}
                                >

                                    <MenuItem value='pending'>
                                        Pending
                                    </MenuItem>
                                    <MenuItem value='confirmed'>
                                        Confirmed
                                    </MenuItem>

                                </TextField>
                            ) : bookingData?.status === 'confirmed' && (
                                <TextField
                                    label="Status"
                                    select
                                    fullWidth
                                    margin="normal"
                                    onChange={handleChangeStatus}
                                    value={bookingData?.status}
                                >
                                    <MenuItem value='confirmed'>
                                        Confirmed
                                    </MenuItem>
                                    <MenuItem value='completed'>
                                        Completed
                                    </MenuItem>
                                </TextField>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen(false)}>Exit</Button>
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
