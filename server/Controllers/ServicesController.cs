using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TikintiApi.DTOs;
using TikintiApi.Services;

namespace TikintiApi.Controllers;

[ApiController]
[Route("api/services")]
public class ServicesController(ServicesService servicesService) : ControllerBase
{
    [HttpGet]
    public async Task<List<ServiceResponse>> GetActive() =>
        await servicesService.GetActiveAsync();

    [HttpGet("all")]
    [Authorize]
    public async Task<List<ServiceResponse>> GetAll() =>
        await servicesService.GetAllAsync();

    [HttpGet("{id:Guid}")]
    public async Task<ActionResult<ServiceResponse>> Get(Guid id)
    {
        var result = await servicesService.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ServiceResponse>> Create(ServiceRequest request)
    {
        var created = await servicesService.CreateAsync(request);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:Guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, ServiceRequest request)
    {
        var updated = await servicesService.UpdateAsync(id, request);
        return updated ? NoContent() : NotFound();
    }

    [HttpPatch("{id:Guid}/move")]
    [Authorize]
    public async Task<IActionResult> Move(Guid id, MoveServiceRequest request)
    {
        if (request.Direction is not ("up" or "down"))
            return BadRequest("Direction must be 'up' or 'down'.");
        var moved = await servicesService.MoveAsync(id, request.Direction);
        return moved ? NoContent() : NotFound();
    }

    [HttpDelete("{id:Guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await servicesService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}
