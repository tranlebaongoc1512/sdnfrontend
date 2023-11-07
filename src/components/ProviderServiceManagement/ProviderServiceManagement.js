import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Backdrop, Box, Button, Fade, Modal, TextField, Typography, MenuItem } from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';


export default function ProviderServiceManagement() {
    const { token } = useContext(AuthContext);
    const [providerServices, setProviderServicesData] = useState([]);

    const [open, setOpen] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [providerServiceData, setProviderServiceData] = useState(null);
    const [isFetchProviderServiceData, setIsFetchProviderServiceData] = useState(false);
    const [providerServiceId, setProviderServiceId] = useState(null);

    useEffect(() => {
        fetchProviderServicesData()
    }, [])
    const fetchProviderServicesData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/service/list', {
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
    const fetchProviderServiceData = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/service/detail/${id}`, {
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
    const fetchCategoriesList = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/category/list', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCategoryList(data.categories);
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
    const deleteProviderService = (id) => {
        Swal.fire({
            title: "Are you sure you want to delete this service?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteService(id)
            }
        });
    };
    const deleteService = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/service/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                Swal.fire({
                    title: "Deleted!",
                    text: "This service has been deleted.",
                    icon: "success"
                });
                fetchProviderServicesData()
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
                    const response = await fetch(`http://localhost:8000/api/service/update/${providerServiceId}`, {
                        method: 'PUT',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        Swal.fire({
                            title: "Service updated successfully",
                            icon: "success"
                        });
                        formik.resetForm();
                        fetchProviderServicesData()
                        setOpen(false);
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
            } else {
                try {
                    const response = await fetch('http://localhost:8000/api/service/add', {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        Swal.fire({
                            title: "Service added successfully",
                            icon: "success"
                        });
                        formik.resetForm();
                        setOpen(false);
                        fetchProviderServicesData()
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
            renderCell: (params) => params.row.categoryId.name
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
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => deleteProviderService(params.row.id)}
                    />
                </div>
            ),
        },
    ];

    const rows = providerServices

    return (
        <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
            <Button variant="outlined" onClick={() => addProviderService()} sx={{ margin: '10px 0 5px 0', backgroundColor: 'white', borderColor: '#6DABB4', color: 'black' }}>+ Add Provider Service</Button>
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
                        <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>{isEditMode ? 'Update Provider Service' : 'Add Provider Service'}</Typography>
                        <TextField
                            id="name"
                            label="Service Name"
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
                                <MenuItem key={category._id} value={category._id}>
                                    {category.name}
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