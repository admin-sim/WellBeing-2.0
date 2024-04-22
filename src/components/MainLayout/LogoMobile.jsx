import React from "react";
import Logo1 from "../../assets/smileslogo.png";

import { NavLink } from "react-router-dom";

export default function LogoMobile() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <NavLink to="/dashboard">
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "green",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            <img src={Logo1} height={30} width={"auto"} />
            WellBeing
          </span>
        </NavLink>
      </div>
    </div>
  );
}
