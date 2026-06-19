using System;

namespace Loanitol.Api.DTOs
{
    public record RegisterRequest(string Email, string Password, string Role);
    public record LoginRequest(string Email, string Password);
    public record AuthResponse(string Token, Guid UserId, string Email, string Role);
}
