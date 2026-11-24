import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section style={{
      width: '100%',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: 'clamp(60px, 8vw, 140px) 3.47vw',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontWeight: 600,
        fontSize: 'clamp(32px, 4vw, 70px)',
        color: '#000',
        margin: 0,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      }}>
        Page Not Found
      </h1>
      <p style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontWeight: 300,
        fontSize: 'clamp(12px, 0.95vw, 15px)',
        color: '#555',
        margin: 0,
        lineHeight: 1.7,
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          fontFamily: "'Josefin Sans', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(12px, 0.95vw, 15px)',
          color: '#000',
          textDecoration: 'none',
          border: '1px solid #000',
          padding: '10px 22px',
          marginTop: '6px',
          letterSpacing: '0.02em',
          backgroundColor: '#fff',
        }}
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFound;