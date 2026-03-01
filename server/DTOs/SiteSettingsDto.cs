using TikintiApi.Entities;

namespace TikintiApi.DTOs;

public record SiteSettingsRequest(
    string CompanyName,
    string CompanyDescription,
    string AboutText1,
    string AboutText2,
    List<Stat> Stats,
    List<Achievement> Achievements,
    ContactInfo ContactInfo,
    List<WorkingHour> WorkingHours,
    List<SocialLink> SocialLinks,
    List<string> CoreValues,
    string HeroTitle,
    string HeroSubtitle,
    string HeroTagline,
    List<string> HeroImages,
    string AboutHeading,
    List<string> AboutImages);

public record SiteSettingsResponse(
    Guid Id,
    string CompanyName,
    string CompanyDescription,
    string AboutText1,
    string AboutText2,
    List<Stat> Stats,
    List<Achievement> Achievements,
    ContactInfo ContactInfo,
    List<WorkingHour> WorkingHours,
    List<SocialLink> SocialLinks,
    List<string> CoreValues,
    string HeroTitle,
    string HeroSubtitle,
    string HeroTagline,
    List<string> HeroImages,
    string AboutHeading,
    List<string> AboutImages);
