using System;
using System.Threading.Tasks;
using Loanitol.Api.Data;
using Loanitol.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Loanitol.Api.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;
        public UserRepository(AppDbContext db) { _db = db; }

        public async Task CreateAsync(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetByIdAsync(Guid id)
        {
            return await _db.Users.FindAsync(id);
        }
    }
}