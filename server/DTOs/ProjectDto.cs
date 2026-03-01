namespace TikintiApi.DTOs;

public record ProjectRequest(
    string Title,
    string Category,
    string Location,
    string Date,
    string Area,
    string Description,
    string ImageUrl);

public record ProjectResponse(
    Guid Id,
    string Title,
    string Category,
    string Location,
    string Date,
    string Area,
    string Description,
    string ImageUrl);
