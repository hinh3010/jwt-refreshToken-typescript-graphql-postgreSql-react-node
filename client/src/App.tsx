import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Profile from './components/pages/Profile';
import { useContext, useEffect, useState } from 'react';
import { AuthContext, useAuthContext } from './contexts/AuthContext';

function App() {

    const [loading, setLoading] = useState(true)
    // const { checkAuth } = useContext(AuthContext)
    const { checkAuth } = useAuthContext()

    // ngay khi run App can kiem tra 
    useEffect(() => {
        const authenticate = async () => {
            await checkAuth()
            setLoading(false)
        }
        authenticate()
    }, [checkAuth])

    if (loading) return <h1>loading</h1>
    return (
        <div className="App" style={{ textAlign: 'center' }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />} >
                        <Route index element={<Home />} />
                        <Route path='login' element={<Login />} />
                        <Route path='register' element={<Register />} />
                        <Route path='profile' element={<Profile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
