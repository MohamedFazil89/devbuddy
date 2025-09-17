function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        const { message = "Invalid credentials" } = await res.json();
        setError(message);
      }
    } catch {
      setError("Server error, try again later");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ p: 4, textAlign: "center", borderRadius: "12px" }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img src={logo} alt="Admin Logo" style={{ height: 80 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", mb: 3 }}>
            Admin Login
          </Typography>
          {/* Add form fields for email and password here */}
          <Button onClick={handleLogin}>Login</Button>
          {error && <Typography color="error">{error}</Typography>}
        </Paper>
      </Container>
    </Box>
  );
}