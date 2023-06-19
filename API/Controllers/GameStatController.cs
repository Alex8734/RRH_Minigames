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
    public IActionResult UpdatePlayerStat([FromBody] NewStat playerStat)
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var stats = _context.Stats.Where(s => s.Guid == userGuid).ToList();
        var user =_context.Users.FirstOrDefault(u => u.GUID == userGuid);
        var stat = stats.FirstOrDefault(s => s.Game == playerStat.Game);
        
        if(stat != null)
        {
            stat.PlayCount++;
            if(playerStat.Game == AvailableGames.Chess 
               || playerStat.Game == AvailableGames.TicTacToe)
            {
                stat.HighScore = playerStat.Score <= 0 ? stat.HighScore + 1 : stat.HighScore;
            }
            else
            {
                stat.HighScore = Math.Max(stat.HighScore, playerStat.Score);
            }
            
        }
        else
        {
            var newStat = new PlayerStat()
            {
                Game = playerStat.Game,
                Guid = userGuid!,
                User = user!,
                Id = _context.Stats.Count() +1,
                HighScore = 0,
                PlayCount = 1
            };
            if(playerStat.Game == AvailableGames.Chess 
               || playerStat.Game == AvailableGames.TicTacToe)
            {
                newStat.HighScore = playerStat.Score <= 0 ? newStat.HighScore + 1 : newStat.HighScore;
            }
            else
            {
                newStat.HighScore = Math.Max(newStat.HighScore, playerStat.Score);
            }
            _context.Stats.Add(newStat);
        }
        
        _context.SaveChanges();
        return GetPlayerStat();
    }
    
    
    [HttpGet("Stats")]
    //[AllowAnonymous]
    public IActionResult GetPlayerStat()
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var stats = _context.Stats.Where(s => s.Guid == userGuid).ToList();
        
        return Ok(new JsonOutput<PlayerStat[]>(stats.ToArray()));
        
        
    }
}