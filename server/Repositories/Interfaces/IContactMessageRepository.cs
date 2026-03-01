using TikintiApi.DTOs;
using TikintiApi.Entities;

namespace TikintiApi.Repositories.Interfaces;

public interface IContactMessageRepository
{
    Task<IEnumerable<ContactMessageEntity>> GetAllAsync();
    Task<long> GetUnreadCountAsync();
    Task<ContactMessageEntity?> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(SubmitContactRequest request, DateTime submittedAt);
    Task<bool> MarkAsReadAsync(Guid id);
    Task<bool> DeleteAsync(Guid id);
}
