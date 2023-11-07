import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar } from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';
import Swal from 'sweetalert2';


export default function ServiceManagement() {
    const { token } = useContext(AuthContext);
    const [services, setServicesData] = useState([]);

    useEffect(() => {
        fetchServicesData(token)
    }, [])
    const banService = (id) => {
        Swal.fire({
            title: "Are you sure you want to ban this service?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, ban it!"
        }).then((result) => {
            if (result.isConfirmed) {
                ban(id)
            }
        });
    }
    const ban = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/service/banService/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                Swal.fire({
                    title: "Banned!",
                    text: "This service has been banned.",
                    icon: "success"
                });
                fetchServicesData()
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
    const fetchServicesData = async () => {
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
                setServicesData(data.services);
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
    const columns = [
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
            field: 'provider',
            headerName: 'Provider',
            width: 200,
            renderCell: (params) => params.row.providerId.fullName
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 100,
            renderCell: (params) => params.row.categoryId.name
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
            width: 200,
            renderCell: (params) => params.row.price
        },
        {
            field: 'bans',
            headerName: 'Ban',
            width: 100,
            renderCell: (params) => (
                <div>
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => banService(params.row._id)}
                    />
                </div>
            ),
        },
    ];

    const rows = services

    return (
        <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
            <DataGrid
                rows={rows}
                getRowId={(row) => row._id}
                columns={columns}
                editMode="row"
                components={{
                    Toolbar: GridToolbarContainer,
                    ToolbarExport: GridToolbarExport,
                }}
                sx={{ backgroundColor: 'white' }}
            />
        </div>
    );
}