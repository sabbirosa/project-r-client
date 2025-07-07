/**
 * USAGE EXAMPLES - How to use the API hooks
 * 
 * This file contains examples of how to use the API hooks
 * with useApi and useApiEffect hooks in your components.
 */

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import useApi from '../hooks/useApi';
import useApiEffect from '../hooks/useApiEffect';
import useAdminAPI from './useAdminAPI';
import useAuthAPI from './useAuthAPI';
import useDonationAPI from './useDonationAPI';
import usePublicAPI from './usePublicAPI';

// ======= EXAMPLES FOR useApi (Manual API calls) =======

export const ManualApiExamples = () => {
  const { request, loading, error } = useApi();
  const authAPI = useAuthAPI();
  const donationAPI = useDonationAPI();
  const adminAPI = useAdminAPI();

  // Example 1: Login function
  const handleLogin = async (credentials) => {
    try {
      const userData = await request(
        () => authAPI.login(credentials),
        {
          showSuccessToast: true,
          successMessage: 'Login successful!',
          onSuccess: (data) => {
            // Handle successful login (e.g., save token, redirect)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      );
      console.log('User data:', userData);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  // Example 2: Create donation request
  const handleCreateDonation = async (donationData) => {
    try {
      const newDonation = await request(
        () => donationAPI.createRequest(donationData),
        {
          showSuccessToast: true,
          successMessage: 'Donation request created successfully!',
          onSuccess: (data) => {
            // Redirect to donations page or refresh data
            window.location.href = '/dashboard/my-donation-requests';
          }
        }
      );
    } catch (err) {
      console.error('Failed to create donation:', err);
    }
  };

  // Example 3: Update user status (admin function)
  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await request(
        () => adminAPI.updateUserStatus(userId, status),
        {
          showSuccessToast: true,
          successMessage: `User ${status} successfully!`,
        }
      );
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  return { handleLogin, handleCreateDonation, handleUpdateUserStatus, loading, error };
};

// ======= EXAMPLES FOR useApiEffect (Automatic API calls) =======

export const AutomaticApiExamples = () => {
  const authAPI = useAuthAPI();
  const donationAPI = useDonationAPI();
  const adminAPI = useAdminAPI();

  // Example 1: Fetch user profile on component mount
  const {
    data: userProfile,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useApiEffect(
    () => authAPI.getProfile(),
    [], // No dependencies - runs only on mount
    {
      showErrorToast: true,
      onSuccess: (data) => {
        console.log('Profile loaded:', data);
      }
    }
  );

  // Example 2: Fetch donation requests with dependency on user change
  const userId = "some-user-id"; // This could come from context
  const {
    data: donationRequests,
    loading: donationsLoading,
    error: donationsError,
    refetch: refetchDonations
  } = useApiEffect(
    () => donationAPI.getMyRequests({ page: 1, limit: 10 }),
    [userId], // Refetch when userId changes
    {
      showErrorToast: true,
      onSuccess: (data) => {
        console.log('Donations loaded:', data);
      }
    }
  );

  // Example 3: Fetch dashboard stats (admin)
  const {
    data: dashboardStats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useApiEffect(
    () => adminAPI.getDashboardStats(),
    [],
    {
      showErrorToast: true,
    }
  );

  return {
    userProfile,
    profileLoading,
    profileError,
    refetchProfile,
    donationRequests,
    donationsLoading,
    donationsError,
    refetchDonations,
    dashboardStats,
    statsLoading,
    statsError,
    refetchStats
  };
};

// ======= COMPONENT USAGE EXAMPLES =======

// Example React Component using the APIs
export const ExampleComponent = () => {
  const { request, loading, error } = useApi();
  const publicAPI = usePublicAPI();
  
  // Fetch data on mount
  const { data: blogs, loading: blogsLoading, refetch } = useApiEffect(
    () => publicAPI.getPublishedBlogs({ page: 1, limit: 5 }),
    []
  );

  // Manual action
  const handleSearch = async (searchParams) => {
    try {
      const results = await request(
        () => publicAPI.searchDonors(searchParams),
        {
          showSuccessToast: false,
          showErrorToast: true,
        }
      );
      console.log('Search results:', results);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  if (blogsLoading) return <div>Loading blogs...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <h1>Blogs</h1>
      {blogs?.map(blog => (
        <div key={blog.id}>{blog.title}</div>
      ))}
      
      <button onClick={() => handleSearch({ bloodGroup: 'A+', district: 'Dhaka' })}>
        {loading ? 'Searching...' : 'Search Donors'}
      </button>
      
      <button onClick={refetch}>Refresh Blogs</button>
    </div>
  );
};

// ======= LOGIN FORM EXAMPLE =======

export const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const authAPI = useAuthAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await authAPI.login(credentials);
      toast.success('Login successful!');
      
      // Save token and redirect
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user.user));
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// ======= DONATION REQUEST FORM =======

export const DonationRequestForm = () => {
  const [formData, setFormData] = useState({
    recipientName: '',
    hospitalName: '',
    bloodGroup: '',
    donationDate: '',
    requestMessage: ''
  });
  const [loading, setLoading] = useState(false);
  const donationAPI = useDonationAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await donationAPI.createRequest(formData);
      toast.success('Donation request created successfully!');
      
      // Reset form or redirect
      setFormData({
        recipientName: '',
        hospitalName: '',
        bloodGroup: '',
        donationDate: '',
        requestMessage: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Recipient Name"
        value={formData.recipientName}
        onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
        required
      />
      <input
        placeholder="Hospital Name"
        value={formData.hospitalName}
        onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
        required
      />
      <select
        value={formData.bloodGroup}
        onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
        required
      >
        <option value="">Select Blood Group</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>
      <input
        type="date"
        value={formData.donationDate}
        onChange={(e) => setFormData(prev => ({ ...prev, donationDate: e.target.value }))}
        required
      />
      <textarea
        placeholder="Why do you need blood?"
        value={formData.requestMessage}
        onChange={(e) => setFormData(prev => ({ ...prev, requestMessage: e.target.value }))}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Request'}
      </button>
    </form>
  );
};

// ======= DATA FETCHING EXAMPLE =======

export const DonationsList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const donationAPI = useDonationAPI();

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await donationAPI.getMyRequests({ page: 1, limit: 10 });
      setDonations(data.donations || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch donations');
      toast.error('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      await donationAPI.deleteRequest(id);
      toast.success('Request deleted successfully');
      fetchDonations(); // Refresh the list
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  if (loading) return <div>Loading donations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Donation Requests</h2>
      <button onClick={fetchDonations}>Refresh</button>
      
      {donations.length === 0 ? (
        <p>No donation requests found.</p>
      ) : (
        <div>
          {donations.map(donation => (
            <div key={donation._id} className="donation-card">
              <h3>{donation.recipientName}</h3>
              <p>Blood Group: {donation.bloodGroup}</p>
              <p>Hospital: {donation.hospitalName}</p>
              <p>Date: {donation.donationDate}</p>
              <p>Status: {donation.status}</p>
              <button onClick={() => handleDelete(donation._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ======= ADMIN USER MANAGEMENT =======

export const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminAPI = useAdminAPI();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getAllUsers({ page: 1, limit: 20 });
      setUsers(data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      await adminAPI.updateUserStatus(userId, newStatus);
      toast.success(`User ${newStatus} successfully!`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to ${newStatus} user`);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}!`);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>All Users</h2>
      <button onClick={fetchUsers}>Refresh</button>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                {user.status === 'active' ? (
                  <button onClick={() => handleUpdateUserStatus(user._id, 'blocked')}>
                    Block
                  </button>
                ) : (
                  <button onClick={() => handleUpdateUserStatus(user._id, 'active')}>
                    Unblock
                  </button>
                )}
                
                <select onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}>
                  <option value="">Change Role</option>
                  <option value="donor">Donor</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ======= SEARCH DONORS EXAMPLE =======

export const SearchDonors = () => {
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    district: '',
    upazila: ''
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const publicAPI = usePublicAPI();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const results = await publicAPI.searchDonors(searchParams);
      setDonors(results.donors || []);
    } catch (error) {
      toast.error('Search failed');
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Donors</h2>
      
      <form onSubmit={handleSearch}>
        <select
          value={searchParams.bloodGroup}
          onChange={(e) => setSearchParams(prev => ({ ...prev, bloodGroup: e.target.value }))}
          required
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <input
          placeholder="District"
          value={searchParams.district}
          onChange={(e) => setSearchParams(prev => ({ ...prev, district: e.target.value }))}
          required
        />

        <input
          placeholder="Upazila"
          value={searchParams.upazila}
          onChange={(e) => setSearchParams(prev => ({ ...prev, upazila: e.target.value }))}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {donors.length > 0 && (
        <div>
          <h3>Found {donors.length} donors:</h3>
          {donors.map(donor => (
            <div key={donor._id} className="donor-card">
              <h4>{donor.name}</h4>
              <p>Blood Group: {donor.bloodGroup}</p>
              <p>Location: {donor.district}, {donor.upazila}</p>
              <p>Email: {donor.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/*
========= QUICK REFERENCE ==========

1. Import what you need:
   import useAuthAPI from '../api/useAuthAPI';
   import useApi from '../hooks/useApi';
   import useApiEffect from '../hooks/useApiEffect';

2. For manual API calls (button clicks, form submissions):
   const { request, loading, error } = useApi();
   const authAPI = useAuthAPI();
   
   const handleAction = async () => {
     await request(() => authAPI.login(data));
   };

3. For automatic API calls (data fetching on mount):
   const donationAPI = useDonationAPI();
   const { data, loading, error, refetch } = useApiEffect(
     () => donationAPI.getMyRequests(),
     [dependency]
   );

4. Available API hooks:
   - useAuthAPI() - Authentication operations
   - useDonationAPI() - Donation management
   - useAdminAPI() - Admin operations
   - usePublicAPI() - Public endpoints

5. All API hooks automatically use useAxiosSecure for 
   authentication headers and error handling.
*/ 