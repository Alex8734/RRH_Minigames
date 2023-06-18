using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RRH_Minigames_API.Identity;

namespace RRH_Minigames_API.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class GameController : ControllerBase
{
    private readonly DataContext _context;

    public GameController(DataContext context)
    {
        _context = context;
    }
    
    [HttpPost("LastMove")]
    public IActionResult PostLastMove([FromBody] GetMoveData data)
    {
        var game = GameManager.PlayingGames.Find(g => g.GameId == data.gameId);
        if(game == null) return NotFound();
        game!.Moves.Add(new Move
        {
            Game = game,
            GameId = data.gameId,
            Id = game.Moves.Count,
            MoveString = data.move
        });
        _context.SaveChanges();
        return Ok();
    }
    [HttpGet("LastMove")]
    public IActionResult GetLastMove([FromBody] string gameId)
    {
        var game = GameManager.PlayingGames.Find(g => g.GameId == gameId);
        if(game == null) return NotFound();
        return Ok(new JsonOutput<string>( game.Moves[^1].MoveString));
    }
    
    [HttpGet("Players")]
    public IActionResult GetPlayers(string gameId)
    {
        var game = GameManager.PlayingGames.FirstOrDefault(g => g.GameId == gameId);
        
        var player1 = _context.Users.FirstOrDefault(u => u.GUID == game!.Player1Guid);
        var player2 = _context.Users.FirstOrDefault(u => u.GUID == game!.Player2Guid);
        
        return Ok(new JsonOutput<string[]>(new[]{ player1!.UserName, player2!.UserName}));
    }
    
    [HttpGet("GameStarted")]
    public IActionResult CheckForGameStart(string gameId)
    {
        var game = GameManager.PlayingGames.FirstOrDefault(g => g.GameId == gameId);
        if(game == null) return NotFound();
        return Ok(new JsonOutput<bool>( game.Player2Guid != null));
    }
    
    [HttpPost("Queue")]
    public IActionResult QueueGame([FromBody] AvailableGames game)
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var user = _context.Users.FirstOrDefault(u => u.GUID == userGuid);
        if(user == null) return BadRequest($"User: {userGuid} not found");
        if (!GameManager.Queue(user!, game, _context, out var newGame)) return BadRequest("already queued");
        if(newGame == null) return Ok(new JsonOutput<string>("Queueing"));
        return Ok(new JsonOutput<string>(newGame.GameId));
    }
}