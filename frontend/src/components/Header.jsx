import { Link } from 'react-router-dom';

const Header=() =>{
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
          <Link to='/allsubmissions'>
            <li>Submissions</li>
          </Link>
          <Link to='/login'>
            <li>Login</li>
          </Link>
          <Link to='/signup'>
            <li>Signup</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Header;