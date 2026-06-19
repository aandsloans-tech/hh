using System;
using System.Threading.Tasks;
using Loanitol.Api.Models;

namespace Loanitol.Api.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByIdAsync(Guid id);
        Task CreateAsync(User user);
    }
}