using TikintiApi.DTOs;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Services;

public class ContactMessagesService(IContactMessageRepository repo)
{
    public async Task<List<ContactMessageResponse>> GetAllAsync()
        => (await repo.GetAllAsync()).Select(ToResponse).ToList();

    public async Task<long> GetUnreadCountAsync()
        => await repo.GetUnreadCountAsync();

    public async Task<ContactMessageResponse?> GetByIdAsync(Guid id)
    {
        var entity = await repo.GetByIdAsync(id);
        return entity is null ? null : ToResponse(entity);
    }

    public async Task<ContactMessageResponse> CreateAsync(SubmitContactRequest request)
    {
        var now = DateTime.UtcNow;
        var id = await repo.CreateAsync(request, now);
        return new ContactMessageResponse(id, request.Name, request.Phone, request.Email,
            request.Service, request.Message, now, false);
    }

    public async Task<bool> MarkAsReadAsync(Guid id)
        => await repo.MarkAsReadAsync(id);

    public async Task<bool> DeleteAsync(Guid id)
        => await repo.DeleteAsync(id);

    private static ContactMessageResponse ToResponse(ContactMessageEntity e) =>
        new(e.Id, e.Name, e.Phone, e.Email, e.Service, e.Message, e.SubmittedAt, e.IsRead);
}
