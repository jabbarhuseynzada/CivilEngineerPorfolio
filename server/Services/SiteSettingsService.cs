using System.Text.Json;
using TikintiApi.DTOs;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Services;

public class SiteSettingsService(ISiteSettingsRepository repo)
{
    private static readonly JsonSerializerOptions _json = new(JsonSerializerDefaults.Web);

    public async Task<SiteSettingsResponse?> GetAsync()
    {
        var entity = await repo.GetAsync();
        return entity is null ? null : ToResponse(entity);
    }

    public async Task UpsertAsync(SiteSettingsRequest request)
    {
        var entity = new SiteSettingsEntity
        {
            CompanyName        = request.CompanyName,
            CompanyDescription = request.CompanyDescription,
            AboutText1         = request.AboutText1,
            AboutText2         = request.AboutText2,
            Stats              = JsonSerializer.Serialize(request.Stats, _json),
            Achievements       = JsonSerializer.Serialize(request.Achievements, _json),
            ContactInfo        = JsonSerializer.Serialize(request.ContactInfo, _json),
            WorkingHours       = JsonSerializer.Serialize(request.WorkingHours, _json),
            SocialLinks        = JsonSerializer.Serialize(request.SocialLinks, _json),
            CoreValues         = JsonSerializer.Serialize(request.CoreValues, _json),
            HeroTitle          = request.HeroTitle,
            HeroSubtitle       = request.HeroSubtitle,
            HeroTagline        = request.HeroTagline,
            HeroImages         = JsonSerializer.Serialize(request.HeroImages, _json),
            AboutHeading       = request.AboutHeading,
            AboutImages        = JsonSerializer.Serialize(request.AboutImages, _json),
        };
        await repo.UpsertAsync(entity);
    }

    private static SiteSettingsResponse ToResponse(SiteSettingsEntity e) => new(
        e.Id,
        e.CompanyName,
        e.CompanyDescription,
        e.AboutText1,
        e.AboutText2,
        JsonSerializer.Deserialize<List<Stat>>(e.Stats, _json)             ?? [],
        JsonSerializer.Deserialize<List<Achievement>>(e.Achievements, _json) ?? [],
        JsonSerializer.Deserialize<ContactInfo>(e.ContactInfo, _json)      ?? new(),
        JsonSerializer.Deserialize<List<WorkingHour>>(e.WorkingHours, _json) ?? [],
        JsonSerializer.Deserialize<List<SocialLink>>(e.SocialLinks, _json)  ?? [],
        JsonSerializer.Deserialize<List<string>>(e.CoreValues, _json)      ?? [],
        e.HeroTitle,
        e.HeroSubtitle,
        e.HeroTagline,
        JsonSerializer.Deserialize<List<string>>(e.HeroImages, _json)      ?? [],
        e.AboutHeading,
        JsonSerializer.Deserialize<List<string>>(e.AboutImages, _json)     ?? []);
}
