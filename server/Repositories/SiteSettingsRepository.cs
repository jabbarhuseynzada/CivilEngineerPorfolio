using Dapper;
using TikintiApi.Infrastructure;
using TikintiApi.Entities;
using TikintiApi.Repositories.Interfaces;

namespace TikintiApi.Repositories;

public class SiteSettingsRepository(DbConnectionFactory db) : ISiteSettingsRepository
{
    public async Task<SiteSettingsEntity?> GetAsync()
    {
        await using var conn = db.Create();
        return await conn.QueryFirstOrDefaultAsync<SiteSettingsEntity>(
            "SELECT * FROM site_settings LIMIT 1");
    }

    public async Task UpsertAsync(SiteSettingsEntity entity)
    {
        await using var conn = db.Create();
        var existing = await conn.QueryFirstOrDefaultAsync<SiteSettingsEntity>(
            "SELECT id FROM site_settings LIMIT 1");

        if (existing is null)
        {
            await conn.ExecuteAsync(
                """
                INSERT INTO site_settings
                    (company_name, company_description, about_text1, about_text2,
                     stats, achievements, contact_info, working_hours, social_links, core_values,
                     hero_title, hero_subtitle, hero_tagline, hero_images, about_heading, about_images)
                VALUES
                    (@CompanyName, @CompanyDescription, @AboutText1, @AboutText2,
                     @Stats::jsonb, @Achievements::jsonb, @ContactInfo::jsonb,
                     @WorkingHours::jsonb, @SocialLinks::jsonb, @CoreValues::jsonb,
                     @HeroTitle, @HeroSubtitle, @HeroTagline, @HeroImages::jsonb,
                     @AboutHeading, @AboutImages::jsonb)
                """, entity);
        }
        else
        {
            entity.Id = existing.Id;
            await conn.ExecuteAsync(
                """
                UPDATE site_settings SET
                    company_name = @CompanyName, company_description = @CompanyDescription,
                    about_text1 = @AboutText1, about_text2 = @AboutText2,
                    stats = @Stats::jsonb, achievements = @Achievements::jsonb,
                    contact_info = @ContactInfo::jsonb, working_hours = @WorkingHours::jsonb,
                    social_links = @SocialLinks::jsonb, core_values = @CoreValues::jsonb,
                    hero_title = @HeroTitle, hero_subtitle = @HeroSubtitle,
                    hero_tagline = @HeroTagline, hero_images = @HeroImages::jsonb,
                    about_heading = @AboutHeading, about_images = @AboutImages::jsonb
                WHERE id = @Id
                """, entity);
        }
    }
}
