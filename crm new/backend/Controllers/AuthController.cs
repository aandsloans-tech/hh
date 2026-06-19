using System;
using System.Threading.Tasks;
using Loanitol.Api.DTOs;
using Loanitol.Api.Models;
using Loanitol.Api.Repositories;
using Loanitol.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Loanitol.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _users;
        private readonly JwtService _jwt;

        public AuthController(IUserRepository users, JwtService jwt)
        {
            _users = users;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest("Email and password are required");

            var existing = await _users.GetByEmailAsync(req.Email);
            if (existing != null) return Conflict("A user with that email already exists.");

            var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);
            var user = new User { Email = req.Email.Trim().ToLowerInvariant(), PasswordHash = hash, Role = string.IsNullOrWhiteSpace(req.Role) ? "User" : req.Role };
            await _users.CreateAsync(user);

            var token = _jwt.CreateToken(user);
            return Ok(new AuthResponse(token, user.Id, user.Email, user.Role));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
                return BadRequest("Email and password are required");

            var user = await _users.GetByEmailAsync(req.Email.Trim().ToLowerInvariant());
            if (user == null) return Unauthorized("Invalid credentials");

            var valid = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
            if (!valid) return Unauthorized("Invalid credentials");

            var token = _jwt.CreateToken(user);
            return Ok(new AuthResponse(token, user.Id, user.Email, user.Role));
        }
    }
}
