import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export const Auth: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (isSignUp) {
            // Handle sign up
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                setMessage(`Error signing up: ${error.message}`);
            } else {
                setMessage('Sign up successful! Please check your email to confirm your account.');
            }
        } else {
            // Handle login
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                setMessage(`Error logging in: ${error.message}`);
            }
        }
        setLoading(false);
    };

    return (
        <div style = {styles.container} >
            <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
            <form onSubmit={handleAuth} style = {styles.form}>
                <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style = {styles.input}
                />
                <input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style = {styles.input}
                />
                <button type="submit" disabled={loading} style = {styles.button}>
                    {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
                </button>
            </form>

            {message && <p style = {styles.message}>{message}</p>}

            <button onClick={() => setIsSignUp(!isSignUp)} style = {styles.toggleLink}>
                {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
            </button>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '400px',
        margin: '40px auto',
        padding: '24px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontFamily: 'sans-serif',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '12px',
        marginTop: '16px',
    },
    input: {
        padding: '8px 12px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #aaa',
    },
    button: {
        padding: '10px 16px',
        fontSize: '16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#0066cc',
        color: '#fff',
        cursor: 'pointer',
    },
    message: {
        marginTop: '12px',
        color: '#333',
        fontSize: '14px',
    },
    toggleLink: {
        marginTop: '16px',
        color: '#0066cc',
        cursor: 'pointer',
        textDecoration: 'underline',
        border: 'none',
        background: 'none',
    }
};
