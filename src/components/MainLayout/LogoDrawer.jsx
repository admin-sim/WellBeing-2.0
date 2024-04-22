import React from "react";
import Logo1 from "../../assets/smileslogo.png";

import { NavLink } from "react-router-dom";

export default function LogoDrawer() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <NavLink to="/dashboard">
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              marginLeft: "-2rem",
              color: "green",
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
