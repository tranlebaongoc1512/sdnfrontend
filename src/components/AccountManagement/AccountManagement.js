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


export default function AccountManagement() {
    const { token } = useContext(AuthContext);
    const [accounts, setAccountsData] = useState([]);

    const [accountId, setAccountId] = useState(null);

    useEffect(() => {
        fetchAccountsData(token)
    }, [])
    const fetchAccountsData = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/account', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setAccountsData(data);
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
            field: 'bans',
            headerName: 'Ban',
            width: 100,
            renderCell: (params) => (
                <div>
                    {/* <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => editAccount(params.row.id)}
                    /> */}
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