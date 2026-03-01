namespace TikintiApi.DTOs;

public record ServiceRequest(
    string Title,
    string Description,
    string ImageUrl,
    int Order,
    bool IsActive);

public record ServiceResponse(
    Guid Id,
    string Title,
    string Description,
    string ImageUrl,
    int Order,
    bool IsActive);

public record MoveServiceRequest(string Direction); // "up" | "down"
