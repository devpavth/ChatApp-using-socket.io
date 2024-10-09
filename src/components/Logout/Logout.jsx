import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../../utils/APIRoutes";

function Logout() {
    const navigate = useNavigate();
    const handleClick = async () => {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
        if (!storedUser) return;
  
        const { _id } = storedUser;
        const { status } = await axios.get(`${logoutRoute}/${_id}`);
  
        if (status === 200) {
          localStorage.clear();
          navigate("/login");
        }
      } catch (error) {
        console.error("Logout failed: ", error);
        // display an error message to the user
      }
    };
  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  )
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

export default Logout