namespace TikintiApi.DTOs;

public record SubmitContactRequest(
    string Name,
    string Phone,
    string Email,
    string Service,
    string Message);

public record ContactMessageResponse(
    Guid Id,
    string Name,
    string Phone,
    string Email,
    string Service,
    string Message,
    DateTime SubmittedAt,
    bool IsRead);
