import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Context } from '../store/appContext';
import { Navigate, Link } from 'react-router-dom';
import "../../styles/form.css";

function FormData() {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // Estado para manejar el mensaje de error

    async function sendData(e) {
        e.preventDefault();
        setError('');  // Reiniciar el mensaje de error antes de intentar loguear

        const response = await actions.login(email, password);

        if (!response.success) {
            setError(response.message);  // Mostrar el mensaje de error si falla el login
        }
    }

    return (
        <>
            {store.auth === true ? <Navigate to="/loginok" /> :
                <div className="d-flex justify-content-center align-items-center flex-column">
                    <Form className="form-container" onSubmit={sendData}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label className="futuristic-label">Email address</Form.Label>
                            <Form.Control 
                                className="futuristic-input" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email" 
                                placeholder="Enter email" 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label className="futuristic-label">Password</Form.Label>
                            <Form.Control 
                                className="futuristic-input" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                type="password" 
                                placeholder="Password" 
                            />
                        </Form.Group>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="d-flex justify-content-between">
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                            <Link to="/signup">
                                <Button variant="primary" className="ms-2">Register</Button>
                            </Link>
                        </div>
                    </Form>
                </div>
            }
        </>
    );
}

export default FormData;
