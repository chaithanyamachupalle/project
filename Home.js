import React, { useState } from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBCollapse, MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle the form input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    // Logic to perform search based on the searchQuery (e.g., send it to the backend)
    try {
      const res = await axios.get(`YOUR_API_URL/search?query=${searchQuery}`);
      console.log(res.data);
    } catch (err) {
      console.log("Error searching:", err);
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    localStorage.removeItem("userId");
    navigate("/login"); // Redirect to login after sign out
  };

  // Handle update profile
  const handleUpdateProfile = () => {
    navigate("/profile"); // Navigate to update profile page
  };

  return (
    <>
      {/* Navbar */}
      <MDBNavbar color="primary" dark expand="md">
        <MDBNavbarBrand href="/">
          <img src="YOUR_LOGO_URL" alt="Logo" height="30" />
        </MDBNavbarBrand>

        <MDBCollapse navbar>
          <MDBNavbarNav left>
            {/* Search Form */}
            <form className="form-inline" onSubmit={handleSearch}>
              <MDBInput
                label="Search restaurants, city, or area"
                icon="search"
                value={searchQuery}
                onChange={handleInputChange}
                style={{ marginRight: "10px", backgroundColor: "#f0f8ff" }}
              />
              <MDBBtn color="light" type="submit">
                Search
              </MDBBtn>
            </form>
          </MDBNavbarNav>

          {/* User Profile Dropdown */}
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <img
                    src="https://via.placeholder.com/30" // Placeholder image for user profile
                    alt="User"
                    className="rounded-circle"
                    height="30"
                  />
                </MDBDropdownToggle>
                <MDBDropdownMenu right>
                  <MDBDropdownItem onClick={handleUpdateProfile}>
                    Update Profile
                  </MDBDropdownItem>
                  <MDBDropdownItem onClick={handleSignOut}>
                    Sign Out
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>

      {/* Main content */}
      <MDBContainer className="mt-5 text-center">
        <h1>Welcome to Food Delivery App</h1>
        <p>
          Search for your favorite restaurants, explore cities, and find great places to eat near you!
        </p>
      </MDBContainer>
    </>
  );
};

export default Home;
