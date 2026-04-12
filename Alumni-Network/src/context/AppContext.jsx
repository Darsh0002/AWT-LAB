import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [institute, setInstitute] = useState(null);

  const fetchFeed = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(`${baseURL}/api/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(data.jobs || []);
      setPosts(data.posts || []);
      setEvents(data.events || []);
    } catch (err) {
      console.error("Feed fetch failed", err);
    }
  };

  const fetchInstituteStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(`${baseURL}/api/admin/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(data.students || []);
    } catch (err) {
      console.error("Institute students fetch failed", err);
    }
  };

  const fetchInstitute = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await axios.get(`${baseURL}/api/institute/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInstitute(data);
    } catch (err) {
      console.error("Institute fetch failed", err);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/api/events`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchFeed();
      return { success: true };
    } catch (err) {
      console.error("Event creation failed", err);
      return { success: false, error: err.response?.data?.message || "Failed to create event" };
    }
  };

  const fetchUser = () => {
    try {
      const token = localStorage.getItem("alumnet-user");
      if (!token) {
        setUser(null);
        setLoading(false);
        return null;
      }
      const userData = JSON.parse(token);
      setUser(userData);
      console.log(userData);
      fetchFeed();
      fetchInstitute();
    } catch (err) {
      console.error("User fetch failed", err);
      localStorage.removeItem("alumnet-user");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const createJob = async (jobData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/api/jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchFeed();
      return { success: true };
    } catch (err) {
      console.error("Job creation failed", err);
      return { success: false, error: err.response?.data?.message || "Failed to create job" };
    }
  };

  const createPost = async (postData) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseURL}/api/posts`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchFeed();
      return { success: true };
    } catch (err) {
      console.error("Post creation failed", err);
      return { success: false, error: err.response?.data?.message || "Failed to create post" };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchUser,
        baseURL,
        jobs,
        setJobs,
        posts,
        setPosts,
        events,
        setEvents,
        fetchFeed,
        createEvent,
        createJob,
        students,
        fetchInstituteStudents,
        institute,
        fetchInstitute,
        createPost
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
