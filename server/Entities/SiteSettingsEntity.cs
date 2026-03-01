namespace TikintiApi.Entities;

// Flat DB entity — nested objects are stored as JSONB and mapped as raw JSON strings by Dapper.
public class SiteSettingsEntity
{
    public Guid Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyDescription { get; set; } = string.Empty;
    public string AboutText1 { get; set; } = string.Empty;
    public string AboutText2 { get; set; } = string.Empty;
    // JSONB columns — deserialized in service layer
    public string Stats { get; set; } = "[]";
    public string Achievements { get; set; } = "[]";
    public string ContactInfo { get; set; } = "{}";
    public string WorkingHours { get; set; } = "[]";
    public string SocialLinks { get; set; } = "[]";
    public string CoreValues { get; set; } = "[]";
    // Hero section
    public string HeroTitle { get; set; } = string.Empty;
    public string HeroSubtitle { get; set; } = string.Empty;
    public string HeroTagline { get; set; } = string.Empty;
    public string HeroImages { get; set; } = "[]";
    // About section
    public string AboutHeading { get; set; } = string.Empty;
    public string AboutImages { get; set; } = "[]";
}

// ── Value objects shared between SiteSettingsDto and Models ──────────────────
public class Stat
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}

public class Achievement
{
    public string Number { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
}

public class ContactInfo
{
    public string Phone { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class WorkingHour
{
    public string Days { get; set; } = string.Empty;
    public string Hours { get; set; } = string.Empty;
    public bool IsWorkingDay { get; set; } = true;
}

public class SocialLink
{
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}
