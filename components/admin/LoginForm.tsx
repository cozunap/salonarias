"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            console.error("Supabase login error:", authError);
            setError(authError.message || "Credenciales incorrectas");
        } else {
            onSuccess();
        }
        setLoading(false);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#241815', // --brand-dark
            fontFamily: "'Montserrat', sans-serif"
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: '#ffffff', // --surface
                    padding: '50px 40px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    textAlign: 'center'
                }}>
                    <img
                        src="/assets/salonbeautecarmen-1.svg"
                        alt="Salon Beauté Arias"
                        style={{
                            maxWidth: '180px',
                            marginBottom: '30px',
                            margin: '0 auto 30px', // using 0 auto to center if needed, but text-align: center takes care of inline
                            display: 'inline-block',
                            filter: 'invert(15%) sepia(21%) saturate(579%) hue-rotate(334deg) brightness(91%) contrast(85%)'
                        }}
                    />

                    <h2 style={{
                        color: '#A39691', // --brand-brown
                        marginBottom: '25px',
                        fontWeight: 600,
                        fontSize: '1.4rem',
                        letterSpacing: '-0.5px',
                        textTransform: 'none'
                    }}>
                        Panel de Control
                    </h2>

                    <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="email" style={{
                                display: 'block',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: '#6B7280', // --text-muted
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="salonarias22@gmail.com"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #EAEAEA', // --border-color
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    backgroundColor: '#fdfdfd',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                    color: '#111827' // --text-main
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#D87B8B'; // --brand-red
                                    e.target.style.boxShadow = '0 0 0 3px rgba(227, 0, 15, 0.1)';
                                    e.target.style.backgroundColor = '#ffffff';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#EAEAEA';
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.backgroundColor = '#fdfdfd';
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label htmlFor="password" style={{
                                display: 'block',
                                fontWeight: 500,
                                marginBottom: '8px',
                                color: '#6B7280',
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="********"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #EAEAEA',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    backgroundColor: '#fdfdfd',
                                    outline: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                    color: '#111827'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#D87B8B';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(227, 0, 15, 0.1)';
                                    e.target.style.backgroundColor = '#ffffff';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#EAEAEA';
                                    e.target.style.boxShadow = 'none';
                                    e.target.style.backgroundColor = '#fdfdfd';
                                }}
                            />
                        </div>

                        {error && (
                            <div style={{
                                color: '#D87B8B',
                                fontSize: '0.85rem',
                                marginBottom: '15px',
                                textAlign: 'center',
                                fontWeight: 500
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#D87B8B', // --brand-red
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                margin: '10px 0 0 0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: loading ? 0.7 : 1
                            }}
                            onMouseOver={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#c9000d';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.backgroundColor = '#D87B8B';
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                }
                            }}
                        >
                            <span>Ingresar</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
