using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TikintiApi.DTOs;
using TikintiApi.Services;

namespace TikintiApi.Controllers;

[ApiController]
[Route("api/projects")]
public class ProjectsController(ProjectsService projectsService) : ControllerBase
{
    [HttpGet]
    public async Task<List<ProjectResponse>> GetAll([FromQuery] string? category) =>
        await projectsService.GetAllAsync(category);

    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<ProjectResponse>> Get(Guid id)
    {
        var result = await projectsService.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ProjectResponse>> Create(ProjectRequest request)
    {
        var created = await projectsService.CreateAsync(request);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:Guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, ProjectRequest request)
    {
        var updated = await projectsService.UpdateAsync(id, request);
        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:Guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await projectsService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
