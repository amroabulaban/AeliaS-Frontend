import React, { useMemo, useEffect, useState, startTransition } from "react";
import { useTable } from "react-table";
import { getUsers, getUserById, deleteUser } from "./api";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchId, setSearchId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await getUsers();
        setUserData(users);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (searchId) {
      try {
        const user = await getUserById(searchId);
        setSearchedUser(user);
      } catch (error) {
        console.error("Error fetching user by ID:", error);
        alert("User not found");
      }
    }
  };

  const handleReset = () => {
    setSearchId(""); 
    setSearchedUser(null); 
    setCurrentPage(0); 
  };

  const handleAddNewUser = () => {
    startTransition(() => {
      navigate("/users/form");
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id); 
        const users = await getUsers();
        setUserData(users);
        alert("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  const handleEdit = (id) => {
    startTransition(() => {
      navigate(`/users/form?id=${id}`);
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Age",
        accessor: "age",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <button
              className="delete-button"
              onClick={() => handleDelete(row.original.id)}
            >
              <FaTrash />
            </button>
            <button
              className="edit-button"
              onClick={() => handleEdit(row.original.id)}
            >
              <FaEdit />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const pageCount = Math.ceil(userData.length / rowsPerPage);
  const displayedData = userData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );
  const finalData = searchedUser ? [searchedUser] : displayedData;

  const tableInstance = useTable({ columns, data: finalData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="table-container">
      <h2 className="table-header-title">AeliaS User Management System</h2>
      <div className="header-container">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter User ID"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button onClick={handleReset} className="reset-button">
          Reset
        </button>

        <button onClick={handleAddNewUser} className="add-user-button">
          Add New User
        </button>
      </div>
      <table {...getTableProps()} className="user-table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="table-header">
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="table-row">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="table-cell">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {pageCount}
        </span>
        <button
          onClick={() =>
            handlePageChange(Math.min(pageCount - 1, currentPage + 1))
          }
          disabled={currentPage === pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserTable;
