function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {[
          { path: "/", element: <AdminLogin /> },
          { path: "/dashboard", element: <AddStudent /> },
          { path: "/attendance", element: <Attendance /> },
          { path: "/students", element: <StudentList /> },
          { path: "/poll-summary", element: <PollSummary /> },
        ].map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </ThemeProvider>
  );
}