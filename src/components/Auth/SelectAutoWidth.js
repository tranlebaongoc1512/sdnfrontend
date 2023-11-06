import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SelectAutoWidth() {
  const [role, setRole] = React.useState('');

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div>
      <FormControl fullWidth sx={{ minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Role</InputLabel>
        <Select
          style={{textAlign:'left'}}
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={role}
          onChange={handleChange}
          
          label="Role"
        >
          <MenuItem value="provider">provider</MenuItem>
          <MenuItem value="customer">customer</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
