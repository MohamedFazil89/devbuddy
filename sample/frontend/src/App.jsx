function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AddStudent />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/poll-summary" element={<PollSummary />} />
      </Routes>
    </ThemeProvider>
  );
}