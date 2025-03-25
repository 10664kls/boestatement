import { Box,  Button,  TextField, Typography, Alert, Stack, Theme, } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { setTokensToLocalStorage } from "../utils/tokenStorage";
const Login =() =>  {
  const [error, setError] = useState<boolean>(false)
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/v1/auth/me");
        if (response.status !== 200) {
          navigate("/login");
        }
        navigate("/")
      } catch (error) {
        navigate("/login");
      }
    }

    getProfile();
  }, []);

  const handleSubmit = async(e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const resp = await api.post<{ accessToken: string, refreshToken: string}>(
        "/v1/auth/login",
        {
          username,
          password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (resp.status !== 200) {
        throw new Error()
      }
      setTokensToLocalStorage(resp.data.accessToken, resp.data.refreshToken)
      setPassword("")
      setUsername("")
      setError(false)
      navigate("/")
    } catch (error) {
      setError(true)
      setPassword("")
      setUsername("")
    }
  }
  

  return (
  <Box sx={(them: Theme) =>({
    padding: "2rem",
    maxWidth: "400px",
    margin: "auto",
    marginTop: "10vh",
    border: "1px solid #eee",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
    borderRadius: `calc(${them.shape.borderRadius}px * 2)`,
    [them.breakpoints.down("sm")]: {
      background: "none",
      border: "none",
      boxShadow: "none",
    }
  })}>
    <Stack spacing={2} useFlexGap component={"form"} onSubmit={handleSubmit}>
      <Typography variant="h1" sx={{fontWeight: 500, fontSize: "2rem"}}>
        Login to E-Statement
      </Typography>
                          
      {error && <Alert sx={{display: 'flex', width: '100%', p: 1}} severity="error">Email or password is incorrect</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        value={username}
        autoFocus
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField 
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={password}
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button 
        type="submit"
        fullWidth 
        variant="contained"
        color="primary"
      >
        Login
      </Button>

      <Typography
        component="div"
        variant="body2"
        sx={{textAlign: "center"}}
      >
        Don&apos;t have an account? {" "}
        <span>
          Please contact your administrator
        </span>
      </Typography>

    </Stack>
  </Box>
  )
}

export default Login;