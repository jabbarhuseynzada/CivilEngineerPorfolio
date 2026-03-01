using Dapper;
using TikintiApi.DTOs;
using TikintiApi.Infrastructure;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Repositories;

public class ContactMessageRepository(DbConnectionFactory db) : IContactMessageRepository
{
    public async Task<IEnumerable<ContactMessageEntity>> GetAllAsync()
    {
        await using var conn = db.Create();
        return await conn.QueryAsync<ContactMessageEntity>(
            "SELECT * FROM contact_messages ORDER BY submitted_at DESC");
    }

    public async Task<long> GetUnreadCountAsync()
    {
        await using var conn = db.Create();
        return await conn.ExecuteScalarAsync<long>(
            "SELECT COUNT(*) FROM contact_messages WHERE is_read = FALSE");
    }

    public async Task<ContactMessageEntity?> GetByIdAsync(Guid id)
    {
        await using var conn = db.Create();
        return await conn.QueryFirstOrDefaultAsync<ContactMessageEntity>(
            "SELECT * FROM contact_messages WHERE id = @id", new { id });
    }

    public async Task<Guid> CreateAsync(SubmitContactRequest request, DateTime submittedAt)
    {
        await using var conn = db.Create();
        return await conn.ExecuteScalarAsync<Guid>(
            """
            INSERT INTO contact_messages (name, phone, email, service, message, submitted_at, is_read)
            VALUES (@Name, @Phone, @Email, @Service, @Message, @SubmittedAt, FALSE)
            RETURNING id
            """,
            new { request.Name, request.Phone, request.Email, request.Service, request.Message, SubmittedAt = submittedAt });
    }

    public async Task<bool> MarkAsReadAsync(Guid id)
    {
        await using var conn = db.Create();
        var affected = await conn.ExecuteAsync(
            "UPDATE contact_messages SET is_read = TRUE WHERE id = @id", new { id });
        return affected > 0;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        await using var conn = db.Create();
        var affected = await conn.ExecuteAsync(
            "DELETE FROM contact_messages WHERE id = @id", new { id });
        return affected > 0;
    }
}
