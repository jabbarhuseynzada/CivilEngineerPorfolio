using TikintiApi.DTOs;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Services;

public class ProjectsService(IProjectRepository repo)
{
    public async Task<List<ProjectResponse>> GetAllAsync(string? category = null)
        => (await repo.GetAllAsync(category)).Select(ToResponse).ToList();

    public async Task<ProjectResponse?> GetByIdAsync(Guid id)
    {
        var entity = await repo.GetByIdAsync(id);
        return entity is null ? null : ToResponse(entity);
    }

    public async Task<ProjectResponse> CreateAsync(ProjectRequest request)
    {
        var id = await repo.CreateAsync(request);
        return new ProjectResponse(id, request.Title, request.Category, request.Location,
            request.Date, request.Area, request.Description, request.ImageUrl);
    }

    public async Task<bool> UpdateAsync(Guid id, ProjectRequest request)
        => await repo.UpdateAsync(id, request);

    public async Task<bool> DeleteAsync(Guid id)
        => await repo.DeleteAsync(id);

    private static ProjectResponse ToResponse(ProjectEntity e) =>
        new(e.Id, e.Title, e.Category, e.Location, e.Date, e.Area, e.Description, e.ImageUrl);
}
