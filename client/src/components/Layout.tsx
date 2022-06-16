import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import { useLogoutMutation } from '../generated/graphql'
import JWTManager from '../utils/jwt'

type Props = {}

export default function Layout({ }: Props) {

    const { isAuthenticated, logoutClient } = useAuthContext()
    const [logoutServer, _] = useLogoutMutation()

    const navigate = useNavigate()

    const handleLogout = async () => {
        navigate('.')
        logoutClient()
        await logoutServer({
            variables: { userId: JWTManager.getUserId()?.toString() as string },
        })
    }

    return (
        <div>
            <h1>Layout</h1>
            <nav style={{ borderBottom: '1px solid', paddingBottom: '1rem' }}>
                <Link to='.'>Home</Link> | <Link to='profile'>Profile</Link> | {' '}
                <Link to='login'>Login</Link> | <Link to='register'>Register</Link>| {' '}
                {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
            </nav>
            <Outlet />
        </div>
    )
}