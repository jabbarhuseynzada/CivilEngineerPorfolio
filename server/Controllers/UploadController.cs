using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TikintiApi.Controllers;

[ApiController]
[Route("api/upload")]
[Authorize]
public class UploadController(IWebHostEnvironment env) : ControllerBase
{
    private static readonly string[] _allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    [HttpPost]
    [RequestSizeLimit(10_000_000)] // 10 MB
    public async Task<IActionResult> Upload(IFormFile? file)
    {
        if (file is null || file.Length == 0)
            return BadRequest("Fayl seçilməyib.");

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowed.Contains(ext))
            return BadRequest("Yalnız şəkil faylları qəbul edilir (.jpg, .png, .webp, .gif).");

        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using (var stream = System.IO.File.Create(filePath))
            await file.CopyToAsync(stream);

        var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
        return Ok(new { url });
    }
}
