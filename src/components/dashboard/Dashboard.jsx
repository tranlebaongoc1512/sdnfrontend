import React from 'react';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';
import styles from './dashboard.module.css'

const Dashboard = () => {
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
    ];
    const rows = bookingHistory

    return (
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
                                <img src="./src/assets/images/cancel.png" alt="canceled" className={styles.image} />
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
                                <img src="./src/assets/images/finished.png" alt="finished" className={styles.image} />
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
                                <img src="./src/assets/images/reported.png" alt="reported" className={styles.image} />
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
        </div>
    );
};

export default Dashboard;
