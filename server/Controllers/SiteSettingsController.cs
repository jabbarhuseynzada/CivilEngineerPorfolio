using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TikintiApi.DTOs;
using TikintiApi.Services;

namespace TikintiApi.Controllers;

[ApiController]
[Route("api/site-settings")]
public class SiteSettingsController(SiteSettingsService siteSettingsService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<SiteSettingsResponse>> Get()
    {
        var result = await siteSettingsService.GetAsync();
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> Update(SiteSettingsRequest request)
    {
        await siteSettingsService.UpsertAsync(request);
        return NoContent();
    }
}
