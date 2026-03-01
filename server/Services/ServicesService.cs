using TikintiApi.DTOs;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Services;

public class ServicesService(IServiceRepository repo)
{
    public async Task<List<ServiceResponse>> GetActiveAsync()
        => (await repo.GetActiveAsync()).Select(ToResponse).ToList();

    public async Task<List<ServiceResponse>> GetAllAsync()
        => (await repo.GetAllAsync()).Select(ToResponse).ToList();

    public async Task<ServiceResponse?> GetByIdAsync(Guid id)
    {
        var entity = await repo.GetByIdAsync(id);
        return entity is null ? null : ToResponse(entity);
    }

    public async Task<ServiceResponse> CreateAsync(ServiceRequest request)
    {
        var id = await repo.CreateAsync(request);
        return new ServiceResponse(id, request.Title, request.Description,
            request.ImageUrl, request.Order, request.IsActive);
    }

    public async Task<bool> UpdateAsync(Guid id, ServiceRequest request)
        => await repo.UpdateAsync(id, request);

    public async Task<bool> DeleteAsync(Guid id)
        => await repo.DeleteAsync(id);

    public async Task<bool> MoveAsync(Guid id, string direction)
        => await repo.MoveAsync(id, direction);

    private static ServiceResponse ToResponse(ServiceEntity e) =>
        new(e.Id, e.Title, e.Description, e.ImageUrl, e.Order, e.IsActive);
}
