import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../../ReduxStore/features/counterSlice";


export default function Dashboard() {
  //   const navigate = useNavigate();
  const count = useSelector((state) => state.counter);
  const dispatch = useDispatch();

  return (
    <>
      Dashboard
   
    </>
  );
}
