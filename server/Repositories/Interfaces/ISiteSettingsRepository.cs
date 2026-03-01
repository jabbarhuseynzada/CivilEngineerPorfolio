using TikintiApi.Entities;

namespace TikintiApi.Repositories.Interfaces;

public interface ISiteSettingsRepository
{
    Task<SiteSettingsEntity?> GetAsync();
    Task UpsertAsync(SiteSettingsEntity entity);
}
