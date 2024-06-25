import React from "react";
import Logo1 from "../../assets/smileslogo.png";

import { NavLink } from "react-router-dom";

export default function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon">
        <NavLink to="/dashboard">
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
              color: "#40679E",

              fontFamily: "DancingScript-Bold",
              fontSize: "2rem",
            }}
          >
            <img src={Logo1} height={35} width={"auto"} />
            Wellbeing
            <br />
          </span>
        </NavLink>
      </div>
    </div>
  );
}
