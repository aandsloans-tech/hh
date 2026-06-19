# Loanitol API (scaffold)

This is a minimal scaffold for an ASP.NET Core Web API to secure the CRM with JWT authentication, BCrypt password hashing and EF Core for persistence.

Quick start (Windows, with .NET 7 SDK installed):

1. Open terminal in `backend/`.
2. Restore packages:

```bash
dotnet restore
```

3. Create database (using LocalDB connection string in `appsettings.json`) and run migrations:

```bash
dotnet tool install --global dotnet-ef --version 7.*
dotnet ef migrations add InitialCreate -p Loanitol.Api.csproj
dotnet ef database update -p Loanitol.Api.csproj
```

4. Run the API:

```bash
dotnet run --project Loanitol.Api.csproj
```

Notes
- Update the connection string in `appsettings.json` for production (SQL Server or PostgreSQL).
- Replace `Jwt:Secret` with a strong random secret (store using environment variables in production).
- The scaffold includes `AuthController` with `register` and `login` endpoints. Passwords are hashed using BCrypt.
- Protect other API controllers with `[Authorize]` and role policies like `[Authorize(Roles = "Admin")]`.

Frontend integration (brief):
- Call `POST /api/auth/login` with JSON { "email": "...", "password": "..." }.
- Store returned `token` securely (prefer `sessionStorage`).
- Include header `Authorization: Bearer <token>` on protected requests.

Security considerations
- Use HTTPS in production and ensure JWT secret and DB credentials are stored securely.
- Add rate-limiting and account lockouts to prevent brute-force attacks.
- Validate and sanitize all inputs on server side.

This scaffold is a starting point; if you want I can add additional endpoints (users management, leads endpoints), file upload protection, OTP flow, and deployment scripts.
