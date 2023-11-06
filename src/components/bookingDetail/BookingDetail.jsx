import React, { useState } from 'react';
import { Container, Typography, TextField, MenuItem, Button, Grid } from '@mui/material';

const statusOptions = ["pending", "confirmed", "completed"];

const BookingDetail = () => {
  const [selectedStatus, setSelectedStatus] = useState("Pending");

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSaveStatus = () => {
    // Thực hiện lưu trạng thái vào cơ sở dữ liệu hoặc xử lý theo nhu cầu của bạn.
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Booking Detail</Typography>

      {/* Hiển thị các thông tin khác */}
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

      {/* Trạng thái (status) có thể chỉnh sửa */}
      <TextField
        select
        label="Status"
        fullWidth
        value={selectedStatus}
        onChange={handleStatusChange}
      >
        {statusOptions.map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" color="primary" onClick={handleSaveStatus}>
        Save
      </Button>
    </Container>
  );
};

export default BookingDetail;
