import React from "react";

// import { useSelector, useDispatch } from "react-redux";
// import { increment, decrement } from "../../ReduxStore/features/counterSlice";
import CustomTable from "../../components/customTable";

export default function Dashboard() {
  //   const navigate = useNavigate();
  // const count = useSelector((state) => state.counter);
  // const dispatch = useDispatch();

  const data = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "3",
      name: "Emily",
      age: 28,
      address: "221B Baker Street",
    },
    {
      key: "4",
      name: "Sophia",
      age: 35,
      address: "4 Privet Drive",
    },
    {
      key: "5",
      name: "Daniel",
      age: 25,
      address: "12 Grimmauld Place",
    },
    {
      key: "6",
      name: "Emma",
      age: 39,
      address: "12 Grimmauld Place",
    },
    {
      key: "7",
      name: "Oliver",
      age: 30,
      address: "12 Grimmauld Place",
    },
    {
      key: "8",
      name: "Ava",
      age: 45,
      address: "221B Baker Street",
    },
    {
      key: "9",
      name: "William",
      age: 37,
      address: "4 Privet Drive",
    },
    {
      key: "10",
      name: "Isabella",
      age: 29,
      address: "10 Downing Street",
    },
    {
      key: "11",
      name: "James",
      age: 41,
      address: "4 Privet Drive",
    },
    {
      key: "12",
      name: "Liam",
      age: 34,
      address: "221B Baker Street",
    },
    {
      key: "13",
      name: "Mia",
      age: 27,
      address: "12 Grimmauld Place",
    },
    {
      key: "14",
      name: "Benjamin",
      age: 38,
      address: "10 Downing Street",
    },
    {
      key: "15",
      name: "Charlotte",
      age: 31,
      address: "4 Privet Drive",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const handleEdit = (record) => {
    // edit the item in your data here
    alert(`Editing item with key ${record.key}`);
  };

  const handleDelete = (record) => {
    // delete the item from your data here
    alert(`Deleting item with key ${record.key}`);
  };
  const handleView = (record) => {
    // delete the item from your data here
    alert(`Viewing item with key ${record.key}`);
  };

  return (
    <>
      Dashboard
      {/* <div>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <span>{count}</span>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div> */}
      <div>
        <CustomTable
          columns={columns}
          dataSource={data}
          isFilter={true}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
          pagination={{ pageSize: 5 }}
          // actionColumn={false}
          // size="middle"
          scroll={{
            x: "max-content",
          }}
        />
      </div>
    </>
  );
}
