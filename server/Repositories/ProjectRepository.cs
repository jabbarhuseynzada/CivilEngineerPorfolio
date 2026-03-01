using Dapper;
using TikintiApi.DTOs;
using TikintiApi.Infrastructure;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Repositories;

public class ProjectRepository(DbConnectionFactory db) : IProjectRepository
{
    public async Task<IEnumerable<ProjectEntity>> GetAllAsync(string? category = null)
    {
        await using var conn = db.Create();
        if (string.IsNullOrEmpty(category))
            return await conn.QueryAsync<ProjectEntity>(
                "SELECT * FROM projects ORDER BY id");
        return await conn.QueryAsync<ProjectEntity>(
            "SELECT * FROM projects WHERE category = @category ORDER BY id",
            new { category });
    }

    public async Task<ProjectEntity?> GetByIdAsync(Guid id)
    {
        await using var conn = db.Create();
        return await conn.QueryFirstOrDefaultAsync<ProjectEntity>(
            "SELECT * FROM projects WHERE id = @id", new { id });
    }

    public async Task<Guid> CreateAsync(ProjectRequest request)
    {
        await using var conn = db.Create();
        return await conn.ExecuteScalarAsync<Guid>(
            """
            INSERT INTO projects (title, category, location, date, area, description, image_url)
            VALUES (@Title, @Category, @Location, @Date, @Area, @Description, @ImageUrl)
            RETURNING id
            """, request);
    }

    public async Task<bool> UpdateAsync(Guid id, ProjectRequest request)
    {
        await using var conn = db.Create();
        var affected = await conn.ExecuteAsync(
            """
            UPDATE projects
            SET title = @Title, category = @Category, location = @Location,
                date = @Date, area = @Area, description = @Description, image_url = @ImageUrl
            WHERE id = @id
            """,
            new { request.Title, request.Category, request.Location,
                  request.Date, request.Area, request.Description, request.ImageUrl, id });
        return affected > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        await using var conn = db.Create();
        var affected = await conn.ExecuteAsync(
            "DELETE FROM projects WHERE id = @id", new { id });
        return affected > 0;
    }
}
