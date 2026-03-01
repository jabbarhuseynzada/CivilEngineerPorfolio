using TikintiApi.DTOs;
using TikintiApi.Entities;

namespace TikintiApi.Repositories.Interfaces;

public interface IServiceRepository
{
    Task<IEnumerable<ServiceEntity>> GetActiveAsync();
    Task<IEnumerable<ServiceEntity>> GetAllAsync();
    Task<ServiceEntity?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(ServiceRequest request);
    Task<bool> UpdateAsync(Guid id, ServiceRequest request);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> MoveAsync(Guid id, string direction); // "up" | "down"
}
