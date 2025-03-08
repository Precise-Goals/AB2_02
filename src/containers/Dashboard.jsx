import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import "./Dashboard.css"; // We'll create this next

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const navigate = useNavigate();
  const auth = getAuth();

  // Fetch user and their projects
  useEffect(() => {
    const checkAuth = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          setUser(user);
          await fetchProjects(user.uid);
        } else {
          navigate("/login");
        }
      });
    };

    checkAuth();
  }, [navigate]);

  // Fetch projects from Firestore
  const fetchProjects = async (userId) => {
    setLoading(true);
    try {
      const projectsRef = collection(db, "designs");
      const q = query(
        projectsRef,
        where("userId", "==", userId),
        orderBy("lastModified", "desc")
      );

      const querySnapshot = await getDocs(q);
      const projectsList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projectsList.push({
          id: doc.id,
          name: data.name || "Untitled Project",
          lastModified: data.lastModified
            ? new Date(data.lastModified.toDate())
            : new Date(),
          elements: data.elements,
        });
      });

      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new project
  const createNewProject = () => {
    navigate("/unifusion-ui-builder");
  };

  // Open existing project
  const openProject = (projectId) => {
    navigate(`/unifusion-ui-builder/${projectId}`);
  };

  // Delete a project
  const deleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, "designs", projectId));
      // Refresh projects list
      fetchProjects(user.uid);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project");
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <h1>MY PROJECTS</h1>
        </div>
        <div className="user-profile">
          {user && (
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="dashboard-content">
        <div className="projects-header">
          <div className="projects-actions">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="new-project-btn" onClick={createNewProject}>
              + New Project
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-projects">Loading your projects...</div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <div
                    className="project-preview"
                    onClick={() => openProject(project.id)}
                  >
                    {/* Project preview - simplified for now */}
                    <div className="preview-placeholder">
                      {project.elements && project.elements.length > 0 ? (
                        <div className="has-elements">
                          Design with {project.elements.length} elements
                        </div>
                      ) : (
                        <div className="no-elements">Empty design</div>
                      )}
                    </div>
                  </div>
                  <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-date">
                      Last modified: {formatDate(project.lastModified)}
                    </p>
                    <div className="project-actions">
                      <button
                        className="open-btn"
                        onClick={() => openProject(project.id)}
                      >
                        Open
                      </button>
                      {deleteConfirm === project.id ? (
                        <div className="delete-confirm">
                          <span>Are you sure?</span>
                          <button
                            className="confirm-yes"
                            onClick={() => deleteProject(project.id)}
                          >
                            Yes
                          </button>
                          <button
                            className="confirm-no"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          className="delete-btn"
                          onClick={() => setDeleteConfirm(project.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-projects">
                <p>
                  No projects found{searchTerm ? " matching your search" : ""}.
                </p>
                {!searchTerm && (
                  <button
                    onClick={createNewProject}
                    className="create-first-project"
                  >
                    Create your first project
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
