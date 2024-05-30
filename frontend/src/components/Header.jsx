import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await logout();
    // Don't navigate to /login after logout, stay on the current page
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='bg-slate-400 rounded-b-lg shadow-lg'>
      <div className='flex justify-between max-w-7.5xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold'><strong>Beast Coder Online Judge</strong></h1>
        </Link>
        <ul className='flex gap-4'>
          <Link to='/leaderboard'>
            <li>Leaderboard</li>
          </Link>
          {user ? (
            <>
              <Link to='/allsubmissions'>
                <li>Submissions</li>
              </Link>
              <li>Hi {user.username}</li>
              <li onClick={handleLogoutClick} className='cursor-pointer'>Logout</li>
            </>
          ) : (
            <>
              <Link to='/login'>
                <li>Login</li>
              </Link>
              <Link to='/signup'>
                <li>Signup</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
