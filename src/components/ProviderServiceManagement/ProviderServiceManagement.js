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


export default function ProviderServiceManagement() {
    const { token } = useContext(AuthContext);
    const [providerServices, setProviderServicesData] = useState([]);

    const [open, setOpen] = React.useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [providerServiceData, setProviderServiceData] = useState(null);
    const [isFetchProviderServiceData, setIsFetchProviderServiceData] = useState(false);
    const [providerServiceId, setProviderServiceId] = useState(null);

    useEffect(() => {
        fetchProviderServicesData(token)
    }, [])
    const fetchProviderServicesData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/providerService', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProviderServicesData(data);
            } else {
                // Handle error response
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            alert(error.message);
        }
    };
    const fetchProviderServiceData = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/providerService/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProviderServiceData(data);
                setIsFetchProviderServiceData(true);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching providerService data.');
            setOpen(false);
        }
    };
    const fetchCategoriesList = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCategoryList(data);
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching category data.');
            setOpen(false);
        }
    };
    const addProviderService = () => {
        fetchCategoriesList();
        setIsEditMode(false);
        setProviderServiceId(null);
        setOpen(true)
    };
    const editProviderService = (id) => {
        setIsEditMode(true);
        fetchCategoriesList();
        setProviderServiceId(id)
        fetchProviderServiceData(id);
        setOpen(true);
    };
    useEffect(() => {
        if (isFetchProviderServiceData) {
            formik.setValues({
                name: providerServiceData.name,
                image: providerServiceData.image,
                description: providerServiceData.description,
                price: providerServiceData.price,
                categoryId: providerServiceData.categoryId,
            });
        }
    }, [isFetchProviderServiceData, providerServiceData]);
    const formik = useFormik({
        initialValues: {
            name: '',
            image: '',
            description: '',
            price: 0,
            categoryId: '',
        },
        onSubmit: async (values) => {
            if (isEditMode) {
                try {
                    const response = await fetch(`http://localhost:8000/api/providerService/management/${providerServiceId}`, {
                        method: 'PUT',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        alert('ProviderService updated successfully');
                        formik.resetForm();
                        fetchProviderServicesData(token)
                        setOpen(false);
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error(error);
                    alert('An error occurred while updating the providerService.');
                }
            } else {
                try {
                    // Convert date to the required format MM-dd-yyyy
                    const formattedDate = new Date(values.date).toLocaleDateString('en-US');

                    const response = await fetch('http://localhost:8000/api/providerService/management', {
                        method: 'POST',
                        body: JSON.stringify({ ...values, date: formattedDate }), // Use the formatted date
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        alert('ProviderService added successfully');
                        formik.resetForm();
                        setOpen(false);
                        fetchProviderServicesData(token)
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error(error);
                    alert('An error occurred while adding the providerService.');
                }
            }
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required.'),
            description: Yup.string().required('Required.'),
            price: Yup.number().required('Required.').integer().min(1, 'Must be at least 1'),
            image: Yup.string().required('Required.').url('Invalid URL format'),
            categoryId: Yup.string().required('Required.'),
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
            field: 'price',
            headerName: 'Price',
            width: 110,
            renderCell: (params) => params.row.price
        },
        {
            field: 'categoryId',
            headerName: 'Category ID',
            width: 100,
            renderCell: (params) => params.row.categoryId
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
                        onClick={() => editProviderService(params.row.id)}
                    />
                </div>
            ),
        },
    ];

    const rows = providerServices

    return (
        <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
            <Button variant="outlined" onClick={() => addProviderService()} sx={{ margin: '10px 0 5px 0', backgroundColor: 'white', borderColor: '#6DABB4', color: 'black' }}>+ Add providerService</Button>
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
                        <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>{isEditMode ? 'Update ProviderService' : 'Add ProviderService'}</Typography>
                        <TextField
                            id="name"
                            label="ProviderService Name"
                            fullWidth
                            margin="normal"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && formik.errors.name}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            id="price"
                            label="Price"
                            type="number"
                            fullWidth
                            margin="normal"
                            name="price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={formik.touched.price && formik.errors.price}
                            helperText={formik.touched.price && formik.errors.price}
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

                        {/* Category selection dropdown */}
                        <TextField
                            id="categoryId"
                            label="Category"
                            select
                            fullWidth
                            margin="normal"
                            name="categoryId"
                            value={formik.values.categoryId}
                            onChange={formik.handleChange}
                            error={formik.touched.categoryId && formik.errors.categoryId}
                            helperText={formik.touched.categoryId && formik.errors.categoryId}
                        >
                            {categoryList.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {`${category.id} - ${category.fullName}`}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="description"
                            label="Description"
                            fullWidth
                            margin="normal"
                            name="description"
                            multiline
                            rows={4}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && formik.errors.description}
                            helperText={formik.touched.description && formik.errors.description}
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