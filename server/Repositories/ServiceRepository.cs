using Dapper;
using TikintiApi.DTOs;
using TikintiApi.Infrastructure;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Repositories;

public class ServiceRepository(DbConnectionFactory db) : IServiceRepository
{
    public async Task<IEnumerable<ServiceEntity>> GetActiveAsync()
    {
        await using var conn = db.Create();
        return await conn.QueryAsync<ServiceEntity>(
            """SELECT * FROM services WHERE is_active = TRUE ORDER BY "order" ASC""");
    }

    public async Task<IEnumerable<ServiceEntity>> GetAllAsync()
    {
        await using var conn = db.Create();
        return await conn.QueryAsync<ServiceEntity>(
            """SELECT * FROM services ORDER BY "order" ASC""");
    }

    public async Task<ServiceEntity?> GetByIdAsync(Guid id)
    {
        await using var conn = db.Create();
        return await conn.QueryFirstOrDefaultAsync<ServiceEntity>(
            "SELECT * FROM services WHERE id = @id", new { id });
    }

    public async Task<Guid> CreateAsync(ServiceRequest request)
    {
        await using var conn = db.Create();
        return await conn.ExecuteScalarAsync<Guid>(
            """
            INSERT INTO services (title, description, image_url, "order", is_active)
            VALUES (@Title, @Description, @ImageUrl, @Order, @IsActive)
            RETURNING id
            """, request);
    }

    public async Task<bool> UpdateAsync(Guid id, ServiceRequest request)
    {
        await using var conn = db.Create();
        var affected = await conn.ExecuteAsync(
            """
            UPDATE services
            SET title = @Title, description = @Description, image_url = @ImageUrl,
                "order" = @Order, is_active = @IsActive
            WHERE id = @id
            """,
            new { request.Title, request.Description, request.ImageUrl, request.Order, request.IsActive, id });
        return affected > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        await using var conn = db.Create();
        var affected = await conn.ExecuteAsync(
            "DELETE FROM services WHERE id = @id", new { id });
        return affected > 0;
    }

    public async Task<bool> MoveAsync(Guid id, string direction)
    {
        await using var conn = db.Create();
        // Atomically swap the "order" value of this service with its neighbor.
        // "up" = lower order number (move towards the top of the list).
        // "down" = higher order number (move towards the bottom).
        var sql = direction == "up"
            ? """
              WITH current  AS (SELECT id, "order" FROM services WHERE id = @id),
                   neighbor AS (
                       SELECT id, "order" FROM services
                       WHERE "order" < (SELECT "order" FROM current)
                       ORDER BY "order" DESC LIMIT 1
                   )
              UPDATE services
              SET "order" = CASE
                  WHEN id = (SELECT id FROM current)  THEN (SELECT "order" FROM neighbor)
                  WHEN id = (SELECT id FROM neighbor) THEN (SELECT "order" FROM current)
              END
              WHERE id IN ((SELECT id FROM current), (SELECT id FROM neighbor))
                AND EXISTS (SELECT 1 FROM neighbor)
              """
            : """
              WITH current  AS (SELECT id, "order" FROM services WHERE id = @id),
                   neighbor AS (
                       SELECT id, "order" FROM services
                       WHERE "order" > (SELECT "order" FROM current)
                       ORDER BY "order" ASC LIMIT 1
                   )
              UPDATE services
              SET "order" = CASE
                  WHEN id = (SELECT id FROM current)  THEN (SELECT "order" FROM neighbor)
                  WHEN id = (SELECT id FROM neighbor) THEN (SELECT "order" FROM current)
              END
              WHERE id IN ((SELECT id FROM current), (SELECT id FROM neighbor))
                AND EXISTS (SELECT 1 FROM neighbor)
              """;

        var affected = await conn.ExecuteAsync(sql, new { id });
        return affected > 0;
    }
}
