using Dapper;
using TikintiApi.Infrastructure;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Repositories;

public class AdminUserRepository(DbConnectionFactory db) : IAdminUserRepository
{
    public async Task<AdminUserEntity?> GetByUsernameAsync(string username)
    {
        await using var conn = db.Create();
        return await conn.QueryFirstOrDefaultAsync<AdminUserEntity>(
            "SELECT * FROM admin_users WHERE username = @username", new { username });
    }
}
