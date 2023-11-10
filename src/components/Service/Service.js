import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import { MenuItem, Select, TextField } from "@mui/material";
import "./Service.css";

export default function Service() {
  const [services, setServices] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const fetchCategoriesList = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/category/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategoryList(data.categories);
      } else {
        const errorData = await response.json();
        console.log(errorData.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchCategoriesList();
    const baseURL = "http://localhost:8000/api/service/list";

    fetch(baseURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setServices(data.services);
      })
      .catch((error) => console.log(error.message));
  }, []);

  const handleSearch = async (e) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/service/searchByName",
        {
          method: "POST",
          body: JSON.stringify({ name: e.target.value }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
      } else {
        // Handle error response
        const errorData = await response.json();
        console.log(errorData.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleSearchByCategory = async (e) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/service/searchByCategory",
        {
          method: "POST",
          body: JSON.stringify({ name: e.target.value }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
      } else {
        // Handle error response
        const errorData = await response.json();
        console.log(errorData.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navigation />
      <Container
        sx={{ py: 6, mt: 0 }}
        maxWidth="xl"
        serviceName="content"
        style={{ marginBottom: "120px" }}
      >
        <Typography variant="h4" component="div" sx={{ mb: 3 }}>
          Services
        </Typography>

        <div className="search" style={{float:'right', marginBottom: '50px', marginRight:'80px'}}>
        <TextField 
         style = {{width: 500}} onChange={handleSearch} 
        label="Search" />
        <Select
          label="Category"
     className=""
          onChange={handleSearchByCategory}
        >
          {categoryList.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        </div>

        <Card />

        <div className="b-card">
          {services.map((card) => (
            <>
              <div className="cardContainer" key={card._id}>
                <div className="cardImage">
                  <img src={card.image} alt="" />
                  <div className="cardAttendee">
                    <div className="numberBox">$ {card.price}</div>
                  </div>
                </div>
                <div className="cardContent">
                  <div className="card-name" style={{ padding: "10px 0 10px 0" }}>
                    {card.name}
                  </div>
                  <div className="card-fn" style={{ padding: "10px 0 10px 0" }}>
                    <strong>By:</strong> {card.providerId.fullName}
                  </div>
                  <div className="card-cat" style={{ padding: "10px 0 10px 0" }}>
                    <strong>Category:</strong> {card.categoryId.name}
                  </div>
                </div>
                <CardActions
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#89CED8",
                    borderRadius: "10px",
                  }}
                >
                  <Link to={`${card._id}`}>
                    <Button serviceName="btn" style={{ color: "white" }}>
                      Service Detail
                    </Button>
                  </Link>
                </CardActions>
              </div>
            </>
          ))}
        </div>
      </Container>

      <Footer />
    </>
  );
}
