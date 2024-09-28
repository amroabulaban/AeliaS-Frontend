import React, { useEffect} from "react";
import { useForm } from "react-hook-form";
import { createUser, getUserById, updateUser  } from "./api";
import "./style.css";
import { useNavigate, useLocation } from "react-router-dom";

const UsersForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const user = await getUserById(userId);
        setValue("id", user.id);
        setValue("name", user.name);
        setValue("age", user.age);
      }
    };
    fetchUserData();
  }, [userId, setValue]);

  const onSubmit = async (data) => {
    try {
      if (userId) {
        await updateUser(userId, data);
        alert("User updated successfully!");
      } else {
        await createUser(data);
        alert("User created successfully!");
      }
      navigate("/users");
    } catch (error) {
      console.error("Error processing user:", error);
      alert("Failed to process user. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Add New User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <div className="form-group">
          <label htmlFor="id" className="form-label">
            User ID
          </label>
          <input
            type="text"
            id="id"
            {...register("id", { required: "User ID is required" })}
            className={`form-input ${errors.id ? "error" : ""}`}
          />
          {errors.id && <p className="error-message">{errors.id.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className={`form-input ${errors.name ? "error" : ""}`}
          />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="age" className="form-label">
            Age
          </label>
          <input
            type="number"
            id="age"
            {...register("age", {
              required: "Age is required",
              min: { value: 1, message: "Age must be at least 1" },
            })}
            className={`form-input ${errors.age ? "error" : ""}`}
          />
          {errors.age && <p className="error-message">{errors.age.message}</p>}
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UsersForm;
