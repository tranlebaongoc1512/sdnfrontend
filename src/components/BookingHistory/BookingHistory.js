import React, { useContext, useEffect, useState } from 'react';
import { Backdrop, Box, Button, Checkbox, Fade, FormControlLabel, Grid, MenuItem, Modal, Paper, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';
import styles from './bookinghistory.module.css'
import Navigation from '../Navigation/Navigation';
import FooterComponent from '../Footer/Footer';
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const BookingHistory = () => {
    const { token } = useContext(AuthContext);
    const [bookings, setBookingsData] = useState([]);

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [allBookingLengths, setAllBookingLengths] = useState(null)
    const [bookingId, setBookingId] = useState(null)
    const [serviceId, setServiceId] = useState(null)
    const cancelBooking = (id) => {
        Swal.fire({
            title: "Are you sure you want to cancel this booking?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                cancel(id)
            }
        });
    }
    const cancel = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/booking/cancel/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                Swal.fire({
                    title: "Canceled!",
                    text: "This booking has been canceled.",
                    icon: "success"
                });
                fetchBookingsData()
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
            console.log(token)
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
        fetchBookingData(id);
        setOpen(true);
    };
    const addFeedback = ({ bookingId, serviceId }) => {
        setServiceId(serviceId)
        setBookingId(bookingId);
        setOpen2(true);
    }
    const formik = useFormik({
        initialValues: {
            feedback: '',
            isReported: false,
        },
        onSubmit: async (values) => {
            try {
                values.serviceId = serviceId
                console.log(values)
                const response = await fetch(`http://localhost:8000/api/feedback/addFeedback/${bookingId}`, {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    Swal.fire({
                        title: "Feedback successfully",
                        icon: "success"
                    });
                    formik.resetForm();
                    fetchBookingsData()
                    setOpen2(false);
                    setOpen(false)
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
            }
        },
        validationSchema: Yup.object({
            feedback: Yup.string().required('Required.'),
        }),
    });
    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: (params) => params.row.serviceId.name
        },
        {
            field: 'providerName',
            headerName: 'Provider Name',
            width: 200,
            renderCell: (params) => params.row.serviceId.providerId.fullName
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
            renderCell: (params) => (
                <div>
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => editBooking(params.row._id)}
                    />
                </div>
            )
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
                                <Grid item xs={12}>
                                    <Typography>Address: {bookingData?.status}</Typography>
                                </Grid>
                            </Grid>
                            {bookingData?.status === 'pending' ? (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                    <Button sx={{ marginRight: '10px', backgroundColor: 'red' }} variant="contained" onClick={() => { cancelBooking(bookingData?._id) }} color="primary">Cancel Booking</Button>
                                    <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen(false)}>Cancel</Button>
                                </div>
                            ) : bookingData?.status === 'completed' ? (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                    <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained" onClick={() => { addFeedback({ bookingId: bookingData?._id, serviceId: bookingData?.serviceId._id }) }} color="primary">Feedback</Button>
                                    <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen(false)}>Cancel</Button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                    <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen(false)}>Exit</Button>
                                </div>
                            )}

                        </Box>
                    </Fade>
                </Modal>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open2}
                    onClose={() => setOpen(false)}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                        backdrop: {
                            timeout: 500,
                        },
                    }}
                >
                    <Fade in={open2}>
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
                            <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>Feedback</Typography>
                            <TextField
                                id="feedback"
                                label="Feedback"
                                fullWidth
                                margin="normal"
                                name="feedback"
                                value={formik.values.feedback}
                                onChange={formik.handleChange}
                                error={formik.touched.feedback && formik.errors.feedback}
                                helperText={formik.touched.feedback && formik.errors.feedback}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isReported"
                                        color="primary"
                                        checked={formik.values.isReported}
                                        onChange={formik.handleChange}
                                    />
                                }
                                label="Is Reported"
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
                                <Button sx={{ marginRight: '10px', backgroundColor: '#6dabb4' }} variant="contained" onClick={formik.handleSubmit} color="primary">Submit</Button>
                                <Button variant="outlined" sx={{ borderColor: '#6dabb4', color: '#6dabb4' }} onClick={() => setOpen2(false)}>Cancel</Button>
                            </div>
                        </Box>
                    </Fade>
                </Modal>
            </div>
            <FooterComponent />
        </>

    );
};

export default BookingHistory;
