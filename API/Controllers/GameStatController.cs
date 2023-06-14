using System.Runtime.InteropServices.ComTypes;
using System.Security.Claims;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.JsonWebTokens;
using RRH_Minigames_API.Identity;

namespace RRH_Minigames_API.Controllers;

[Authorize]
[Route("User")]
[ApiController]
public class GameStatController : ControllerBase
{
    private readonly DataContext _context;

    public GameStatController(DataContext context)
    {
        _context = context;
    }
    [HttpPost("Stats")]
    public IActionResult UpdatePlayerStat([FromBody] PlayerStat playerStat)
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var stats = _context.Stats.Where(s => s.Guid == userGuid).ToList();
        var stat = stats.FirstOrDefault(s => s.Game == playerStat.Game);
        if (stat == null)
        {
            playerStat.Guid = userGuid!;
            _context.Stats.Add(playerStat);
        }
        else
        {
            stat.HighScore = stat.HighScore < playerStat.HighScore ? playerStat.HighScore : stat.HighScore;
            stat.PlayCount ++;
        }
        _context.SaveChanges();
        return Ok();
    }
    
    
    [HttpGet("Stats")]
    //[AllowAnonymous]
    public IActionResult GetPlayerStat()
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var stats = _context.Stats.Where(s => s.Guid == userGuid).ToList();
        
        return Ok(stats);
        
        /*Console.WriteLine("UserGuid: " + userGuid);
        userGuid = Guid.NewGuid().ToString();
        var stats = new List<PlayerStat>()
        {
            new PlayerStat
            {
                Game = AvailableGames.Chess,
                Guid = userGuid, // Assign the provided userGuid
                Id = 1,
                HighScore = 12,
                PlayCount = 24
            },
            new PlayerStat
            {
                Game = AvailableGames.CarRacing,
                Guid = userGuid, // Assign the provided userGuid
                Id = 2,
                HighScore = 200,
                PlayCount = 20
            },
            new PlayerStat
            {
                Game = AvailableGames.SpaceShooter,
                Guid = userGuid, // Assign the provided userGuid
                Id = 3,
                HighScore = 100,
                PlayCount = 10
            }
        };

        var user = new DBUser()
        {
            UserName = "TestUser",
            Password = "TestPassword",
            GUID = userGuid, // Assign the provided userGuid
            Stats = stats
        };*/
    }
}