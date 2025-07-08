import React, { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: "Admin", email: "admin@example.com", role: "Managing Partner", approved: true },
  ]);
  const [enquiries, setEnquiries] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [currentView, setCurrentView] = useState("dashboard");
  const [newCase, setNewCase] = useState({
    title: "",
    type: "",
    region: "",
    court: "",
    town: "",
    detention: false,
    assignedTo: "",
    status: "Active",
    visibility: [],
  });
  const [selectedCase, setSelectedCase] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Associate" });
  const [newComment, setNewComment] = useState("");
  const [newEnquiry, setNewEnquiry] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // Mock Login
  const handleLogin = (email) => {
    const user = users.find((u) => u.email === email && u.approved);
    if (user) setUser(user);
  };

  // Create New User (Pending Approval)
  const registerUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([
      ...users,
      { ...newUser, id: Date.now(), approved: false },
    ]);
    setNewUser({ name: "", email: "", role: "Associate" });
    setCurrentView("login");
  };

  // Approve User (Only Managing Partner)
  const approveUser = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, approved: true } : u
      )
    );
  };

  // Add new case
  const addCase = () => {
    if (!newCase.title || !newCase.type || !newCase.region) return;

    const caseToAdd = {
      id: Date.now(),
      ...newCase,
      files: [],
      comments: [],
      viewers: [],
      downloaders: [],
    };
    setCases([...cases, caseToAdd]);
    setNewCase({
      title: "",
      type: "",
      region: "",
      court: "",
      town: "",
      detention: false,
      assignedTo: "",
      status: "Active",
      visibility: [],
    });
    setCurrentView("dashboard");
  };

  // Upload File to Case
  const uploadFile = (caseId, file) => {
    const updatedCases = cases.map((c) => {
      if (c.id === caseId) {
        return {
          ...c,
          files: [
            ...c.files,
            {
              name: `${file.name}-${Date.now()}`,
              uploadedBy: user.name,
              uploadedAt: new Date().toISOString().split("T")[0],
              viewers: [],
              downloaders: [],
            },
          ],
        };
      }
      return c;
    });
    setCases(updatedCases);
  };

  // Track file view
  const trackFileView = (caseId, fileId) => {
    const updatedCases = cases.map((c) => {
      if (c.id !== caseId) return c;

      return {
        ...c,
        files: c.files.map((f) => {
          if (f.name !== fileId) return f;

          return {
            ...f,
            viewers: [...f.viewers, user.name],
          };
        }),
      };
    });
    setCases(updatedCases);
  };

  // Track file download
  const trackFileDownload = (caseId, fileId) => {
    const updatedCases = cases.map((c) => {
      if (c.id !== caseId) return c;

      return {
        ...c,
        files: c.files.map((f) => {
          if (f.name !== fileId) return f;

          return {
            ...f,
            downloaders: [...f.downloaders, user.name],
          };
        }),
      };
    });
    setCases(updatedCases);
  };

  // Submit Enquiry
  const submitEnquiry = () => {
    if (!newEnquiry.name || !newEnquiry.email || !newEnquiry.message) return;
    setEnquiries([...enquiries, { ...newEnquiry, submittedAt: new Date().toISOString().split("T")[0], read: false }]);
    setNewEnquiry({ name: "", phone: "", email: "", message: "" });
    setCurrentView("thank-you");
  };

  // Render Functions

  const renderLoginForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Law Firm Portal</h2>
        <p className="text-center text-gray-600 mb-6">Log in or register</p>

        <select
          onChange={(e) => handleLogin(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
        >
          <option value="">Select User</option>
          {users.filter(u => u.approved).map(u => (
            <option key={u.id} value={u.email}>{u.name} ({u.role})</option>
          ))}
        </select>

        <button onClick={() => setCurrentView("register")} className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">
          Register New User
        </button>
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Register New Account</h2>
        <form onSubmit={(e) => { e.preventDefault(); registerUser(); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Associate Partner">Associate Partner</option>
              <option value="Associate">Associate</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Submit for Approval
          </button>
        </form>
        <button onClick={() => setCurrentView("login")} className="mt-4 text-blue-600 underline">
          Back to Login
        </button>
      </div>
    </div>
  );

  const renderThankYouPage = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p>Your enquiry has been successfully sent.</p>
        <button
          onClick={() => setCurrentView("enquiry")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Send Another Message
        </button>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const accessibleCases = cases.filter(c => c.visibility.includes(user.role));
    
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-900">Legal Case Management</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Logged in as: {user.name} ({user.role})</span>
              <button 
                onClick={() => setUser(null)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700">Total Cases</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{accessibleCases.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700">Active Cases</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{accessibleCases.filter(c => c.status === "Active").length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700">Pending Cases</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{accessibleCases.filter(c => c.status === "Pending").length}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-8 flex flex-wrap gap-4">
            {user.role === "Managing Partner" && (
              <>
                <button
                  onClick={() => setCurrentView("new-case")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Case
                </button>
                <button
                  onClick={() => setCurrentView("training")}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Training Platform
                </button>
              </>
            )}
            {(user.role === "Associate") && (
              <button
                onClick={() => setCurrentView("enquiry")}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact Us
              </button>
            )}
          </div>

          {/* Cases List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Your Cases</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cases..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {accessibleCases.map((caseItem) => (
                <div 
                  key={caseItem.id}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedCase(caseItem);
                    setCurrentView("case-details");
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{caseItem.title}</h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{caseItem.type}</span>
                        <span>•</span>
                        <span>{caseItem.region}</span>
                        <span>•</span>
                        <span>Status: <span className={`font-medium ${
                          caseItem.status === "Active" ? "text-green-600" : "text-yellow-600"
                        }`}>{caseItem.status}</span></span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {caseItem.files.length} Files
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {caseItem.comments.length} Comments
                    </div>
                    
                    <div className="flex space-x-2">
                      {user.role === "Managing Partner" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCaseStatus(caseItem.id, caseItem.status === "Active" ? "Pending" : "Active");
                          }}
                          className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          {caseItem.status === "Active" ? "Mark Pending" : "Reopen"}
                        </button>
                      )}
                      
                      {user.role !== "Associate" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCase(caseItem);
                            setCurrentView("add-comment");
                          }}
                          className="text-sm px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-800"
                        >
                          Comment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {accessibleCases.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No cases found. Please check your filters or request access.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderNewCaseForm = () => (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Create New Case</h1>
          <button 
            onClick={() => setCurrentView("dashboard")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Case Details</h2>
          
          <form onSubmit={(e) => { e.preventDefault(); addCase(); }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Case Title</label>
                <input
                  type="text"
                  value={newCase.title}
                  onChange={(e) => setNewCase({...newCase, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Case Type</label>
                <select
                  value={newCase.type}
                  onChange={(e) => setNewCase({...newCase, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Maritime Law">Maritime Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="International Law">International Law</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <select
                  value={newCase.region}
                  onChange={(e) => setNewCase({...newCase, region: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select region</option>
                  <option value="North-West Cameroon">North-West Cameroon</option>
                  <option value="South-West Cameroon">South-West Cameroon</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Court</label>
                <select
                  value={newCase.court}
                  onChange={(e) => setNewCase({...newCase, court: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Court</option>
                  <option value="Court of First Instance">Court of First Instance</option>
                  <option value="High Court">High Court</option>
                  <option value="Appeal Court">Appeal Court</option>
                  <option value="Supreme Court">Supreme Court</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town</label>
                <input
                  type="text"
                  value={newCase.town}
                  onChange={(e) => setNewCase({...newCase, town: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility Level</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCase.visibility.includes("Associate Partner")}
                        onChange={(e) => {
                          const vis = [...newCase.visibility];
                          if (e.target.checked) vis.push("Associate Partner");
                          else vis.splice(vis.indexOf("Associate Partner"), 1);
                          setNewCase({...newCase, visibility: vis});
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Associate Partner Access</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newCase.visibility.includes("Associate")}
                        onChange={(e) => {
                          const vis = [...newCase.visibility];
                          if (e.target.checked) vis.push("Associate");
                          else vis.splice(vis.indexOf("Associate"), 1);
                          setNewCase({...newCase, visibility: vis});
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Associate Access</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detention Status</label>
                  <select
                    value={newCase.detention ? "yes" : "no"}
                    onChange={(e) => setNewCase({...newCase, detention: e.target.value === "yes"})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Case
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );

  const renderEnquiryForm = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
        <form onSubmit={(e) => { e.preventDefault(); submitEnquiry(); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={newEnquiry.name}
              onChange={(e) => setNewEnquiry({ ...newEnquiry, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={newEnquiry.phone}
              onChange={(e) => setNewEnquiry({ ...newEnquiry, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={newEnquiry.email}
              onChange={(e) => setNewEnquiry({ ...newEnquiry, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows="4"
              value={newEnquiry.message}
              onChange={(e) => setNewEnquiry({ ...newEnquiry, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Send Message
          </button>
        </form>
        <button onClick={() => setCurrentView("dashboard")} className="mt-4 text-blue-600 underline">
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  const renderThankYou = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p>Your message has been successfully sent.</p>
        <button
          onClick={() => setCurrentView("enquiry")}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Send Another Message
        </button>
      </div>
    </div>
  );

  const renderCaseDetails = () => {
    if (!selectedCase) return null;
    
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-900">{selectedCase.title}</h1>
            <button 
              onClick={() => setCurrentView("dashboard")}
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Dashboard
            </button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{selectedCase.title}</h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedCase.status === "Active" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {selectedCase.status}
                </span>
              </div>
              
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{selectedCase.type}</span>
                <span>•</span>
                <span>{selectedCase.region}</span>
                <span>•</span>
                <span>Court: {selectedCase.court}</span>
                <span>•</span>
                <span>Town: {selectedCase.town}</span>
              </div>
            </div>
            
            {/* Files Section */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Files</h3>
              
              <div className="space-y-3">
                {selectedCase.files.map((file, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Uploaded by {file.uploadedBy} on {file.uploadedAt}
                    </div>
                  </div>
                ))}
                
                {selectedCase.files.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No files uploaded yet.</p>
                )}
              </div>
              
              {(user.role === "Managing Partner" || user.role === "Associate Partner") && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                  <div className="flex">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-l-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          uploadFile(selectedCase.id, e.target.files[0]);
                          e.target.value = null; // Reset input
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Comments Section */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Comments</h3>
              
              <div className="space-y-4 mb-6">
                {selectedCase.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{comment.user}</span>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))}
                
                {selectedCase.comments.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No comments yet.</p>
                )}
              </div>
              
              {user.role !== "Associate" && (
                <div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                  
                  <button
                    onClick={() => addCommentToCase(selectedCase.id, newComment)}
                    disabled={!newComment.trim()}
                    className={`mt-2 px-4 py-2 rounded-md ${
                      newComment.trim()
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Post Comment
                  </button>
                </div>
              )}
            </div>
            
            {/* Status Controls */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {user.role === "Managing Partner" && (
                <div className="flex justify-end">
                  <button
                    onClick={() => updateCaseStatus(selectedCase.id, selectedCase.status === "Active" ? "Pending" : "Active")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {selectedCase.status === "Active" ? "Mark as Pending" : "Reopen Case"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderTrainingPlatform = () => (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Training Platform</h1>
          <button 
            onClick={() => setCurrentView("dashboard")}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Assignments</h2>
          
          {user.role === "Managing Partner" && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Create New Assignment</h3>
              
              <form onSubmit={(e) => { e.preventDefault(); addTraining(); }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newTraining.title}
                      onChange={(e) => setNewTraining({...newTraining, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newTraining.description}
                      onChange={(e) => setNewTraining({...newTraining, description: e.target.value})}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                    <select
                      value={newTraining.visibility}
                      onChange={(e) => setNewTraining({...newTraining, visibility: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="private">Private (Only tutor can see)</option>
                      <option value="public">Public (All trainees can see)</option>
                    </select>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="space-y-6">
            {trainings.map((training) => (
              <div key={training.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{training.title}</h3>
                    <p className="mt-2 text-gray-600">{training.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Assigned by {training.assignedBy} | Deadline: {training.deadline}
                    </div>
                  </div>
                  
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    training.visibility === "private" 
                      ? "bg-gray-100 text-gray-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {training.visibility === "private" ? "Private" : "Public"}
                  </span>
                </div>
                
                {user.role === "Associate" && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Submit Assignment</h4>
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-l-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          const file = {
                            name: e.target.files[0].name,
                            submittedAt: new Date().toISOString().split('T')[0]
                          };
                          
                          submitTraining(training.id, file);
                          e.target.value = null; // Reset input
                        }
                      }}
                    />
                    
                    {training.submissions.some(sub => sub.user === user.role) && (
                      <p className="mt-2 text-sm text-green-600">You have already submitted this assignment.</p>
                    )}
                  </div>
                )}
                
                {user.role === "Managing Partner" && training.submissions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Submissions ({training.submissions.length})</h4>
                    <ul className="space-y-2">
                      {training.submissions.map((submission, idx) => (
                        <li key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{submission.file.name}</span>
                          <span className="text-xs text-gray-500">{submission.submittedAt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            
            {trainings.length === 0 && (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No assignments available yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  if (!user) {
    return renderLoginForm();
  }

  switch(currentView) {
    case "dashboard":
      return renderDashboard();
    case "new-case":
      return renderNewCaseForm();
    case "case-details":
      return renderCaseDetails();
    case "training":
      return renderTrainingPlatform();
    case "enquiry":
      return renderEnquiryForm();
    case "thank-you":
      return renderThankYou();
    case "register":
      return renderRegisterForm();
    default:
      return renderDashboard();
  }
}