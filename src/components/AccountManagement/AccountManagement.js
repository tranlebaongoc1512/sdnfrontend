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


export default function AccountManagement() {
    const { token } = useContext(AuthContext);
    console.log(token)
    const [accounts, setAccountsData] = useState([]);

    useEffect(() => {
        fetchAccountsData(token)
    }, [])
    const banAccount = (id) => {
        Swal.fire({
            title: "Are you sure you want to ban this account?",
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
            console.log(token)
            console.log(id)
            const response = await fetch(`http://localhost:8000/api/user/banAccount/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                Swal.fire({
                    title: "Banned!",
                    text: "This account has been banned.",
                    icon: "success"
                });
                fetchAccountsData()
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
    const fetchAccountsData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user/listAllUsers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAccountsData(data.users);
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
            field: 'email',
            headerName: 'Email',
            width: 200,
            renderCell: (params) => params.row.email
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            width: 200,
            renderCell: (params) => params.row.fullName
        },
        {
            field: 'role',
            headerName: 'Category ID',
            width: 100,
            renderCell: (params) => params.row.categoryId
        },
        {
            field: 'isBanned',
            headerName: 'isBanned',
            width: 100,
            renderCell: (params) => { if (params.row.isBanned === true) { return 'true' } else { return 'false' } }
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
                        onClick={() => banAccount(params.row._id)}
                    />
                </div>
            ),
        },
    ];

    const rows = accounts

    return (
        <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
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
        </div>
    );
}