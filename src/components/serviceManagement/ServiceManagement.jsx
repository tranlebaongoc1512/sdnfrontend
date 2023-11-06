import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar} from '@mui/material';
import {
    DataGrid,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';


export default function ServiceManagement() {
    const { token } = useContext(AuthContext);
    const [services, setServicesData] = useState([]);

    const [serviceId, setServiceId] = useState(null);

    useEffect(() => {
        fetchServicesData(token)
    }, [])
    const fetchServicesData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/service', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setServicesData(data);
            } else {
                // Handle error response
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (error) {
            alert(error.message);
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
            field: 'provider',
            headerName: 'Provider',
            width: 200,
            renderCell: (params) => params.row.providerId
        },
        {
            field: 'role',
            headerName: 'Category ID',
            width: 100,
            renderCell: (params) => params.row.categoryId
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
                    {/* <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => editService(params.row.id)}
                    /> */}
                </div>
            ),
        },
    ];

    const rows = services

    return (
        <div style={{ width: '95%', margin: '0px auto 20px auto', borderRadius: '20px' }}>
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
        </div>
    );
}