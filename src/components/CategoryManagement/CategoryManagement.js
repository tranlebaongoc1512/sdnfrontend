import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Backdrop, Box, Button, Fade, Modal, TextField, Typography } from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';


export default function CategoryManagement() {
    const { token } = useContext(AuthContext);
    const [categories, setCategoriesData] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [categoryData, setCategoryData] = useState(null);
    const [isFetchCategoryData, setIsFetchCategoryData] = useState(false);
    const [categoryId, setCategoryId] = useState(null);

    useEffect(() => {
        fetchCategoriesData()
    }, [])
    const fetchCategoriesData = async () => {
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
                setCategoriesData(data.categories);
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
    const fetchCategoryData = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/category/detail/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCategoryData(data.category);
                setIsFetchCategoryData(true);
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
    const addCategory = () => {
        setIsEditMode(false);
        setCategoryId(null);
        setOpen(true)
    };
    const editCategory = (id) => {
        setIsEditMode(true);
        setCategoryId(id)
        fetchCategoryData(id);
        setOpen(true);
    };
    const deleteCategory = (id) => {
        Swal.fire({
            title: "Are you sure you want to delete this category?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCate(id)
            }
        });
    };
    const deleteCate = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/category/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                Swal.fire({
                    title: "Deleted!",
                    text: "This category has been deleted.",
                    icon: "success"
                });
                fetchCategoriesData()
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
        if (isFetchCategoryData) {
            formik.setValues({
                name: categoryData.name,
            });
        }
    }, [isFetchCategoryData, categoryData]);
    const formik = useFormik({
        initialValues: {
            name: '',
        },
        onSubmit: async (values) => {
            if (isEditMode) {
                try {
                    const response = await fetch(`http://localhost:8000/api/category/update/${categoryId}`, {
                        method: 'PUT',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        Swal.fire({
                            title: "Category updated successfully",
                            icon: "success"
                        });
                        formik.resetForm();
                        fetchCategoriesData()
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
                    const response = await fetch('http://localhost:8000/api/category/create', {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        Swal.fire({
                            title: "Category added successfully",
                            icon: "success"
                        });
                        formik.resetForm();
                        setOpen(false);
                        fetchCategoriesData()
                    } else {
                        const errorData = await response.json();
                        Swal.fire({
                            icon: "error",
                            title: errorData.message + "1",
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
        }),
    });

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            width: 200,
            renderCell: (params) => params.row.name
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
                        onClick={() => editCategory(params.row._id)}
                    />
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => deleteCategory(params.row._id)}
                    />
                </div>
            ),
        },
    ];

    const rows = categories

    return (
        <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
            <Button variant="outlined" onClick={() => addCategory()} sx={{ margin: '10px 0 5px 0', backgroundColor: 'white', borderColor: '#6DABB4', color: 'black' }}>+ Add Category</Button>
            {categories.length > 0 ? (
                <DataGrid
                    rows={rows}
                    columns={columns}
                    editMode="row"
                    components={{
                        Toolbar: GridToolbarContainer,
                        ToolbarExport: GridToolbarExport,
                    }}
                    getRowId={(row) => row._id}
                    sx={{ backgroundColor: 'white' }}
                />
            ) : (<div>
                <p>Empty list of category</p>
            </div>)}
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
                        <Typography variant='h4' sx={{ borderBottom: '1px solid black', paddingBottom: '15px', marginBottom: '10px' }}>{isEditMode ? 'Update Category' : 'Add Category'}</Typography>
                        <TextField
                            id="name"
                            label="Name"
                            fullWidth
                            margin="normal"
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && formik.errors.name}
                            helperText={formik.touched.name && formik.errors.name}
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