import { Link } from 'react-router-dom';

const Header=() =>{
  return (
    <div className='bg-slate-200'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold'>Beast Coder Online Judge</h1>
        </Link>
        <ul className='flex gap-4'>
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