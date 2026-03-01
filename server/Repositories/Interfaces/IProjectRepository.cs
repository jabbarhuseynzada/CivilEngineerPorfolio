using TikintiApi.DTOs;
using TikintiApi.Entities;

namespace TikintiApi.Repositories.Interfaces;

public interface IProjectRepository
{
    Task<IEnumerable<ProjectEntity>> GetAllAsync(string? category = null);
    Task<ProjectEntity?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(ProjectRequest request);
    Task<bool> UpdateAsync(Guid id, ProjectRequest request);
    Task<bool> DeleteAsync(Guid id);
}
