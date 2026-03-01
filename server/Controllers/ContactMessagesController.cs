using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TikintiApi.DTOs;
using TikintiApi.Services;

namespace TikintiApi.Controllers;

[ApiController]
[Route("api/contact-messages")]
public class ContactMessagesController(ContactMessagesService messagesService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Submit(SubmitContactRequest request)
    {
        await messagesService.CreateAsync(request);
        return Ok(new { message = "Mesajınız göndərildi! Tezliklə sizinlə əlaqə saxlayacağıq." });
    }

    [HttpGet]
    [Authorize]
    public async Task<List<ContactMessageResponse>> GetAll() =>
        await messagesService.GetAllAsync();

    [HttpGet("unread-count")]
    [Authorize]
    public async Task<long> GetUnreadCount() =>
        await messagesService.GetUnreadCountAsync();

    [HttpPatch("{id:Guid}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var ok = await messagesService.MarkAsReadAsync(id);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:Guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await messagesService.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
