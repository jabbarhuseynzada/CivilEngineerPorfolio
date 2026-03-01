using TikintiApi.Entities;

namespace TikintiApi.Repositories.Interfaces;

public interface IAdminUserRepository
{
    Task<AdminUserEntity?> GetByUsernameAsync(string username);
}
