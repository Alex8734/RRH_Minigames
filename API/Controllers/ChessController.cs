using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RRH_Minigames_API.Identity;

namespace RRH_Minigames_API.Controllers;

[Authorize]
[Route("[controller]")]
[ApiController]
public class ChessController : ControllerBase
{
    private readonly DataContext _context;

    public ChessController(DataContext context)
    {
        _context = context;
    }
    
    [HttpPost("lastMove")]
    public IActionResult PostLastChessMove([FromBody] GetMoveData data)
    {
        var game = GameManager.PlayingGames.Find(g => g.GameId == data.gameId);
        if(game == null) return NotFound();
        game!.Moves.Add(new Move()
        {
            Game = game,
            GameId = data.gameId,
            Id = game.Moves.Count,
            MoveString = data.move
        });
        _context.SaveChanges();
        return Ok();
    }
    [HttpGet("lastMove")]
    public IActionResult GetLastMove([FromBody] string gameId)
    {
        var game = GameManager.PlayingGames.Find(g => g.GameId == gameId);
        if(game == null) return NotFound();
        return Ok(game.Moves[^1].MoveString);
    }
    
    [HttpGet("players")]
    public IActionResult GetChessPlayers(string gameId)
    {
        var game = GameManager.PlayingGames.FirstOrDefault(g => g.GameId == gameId);
        
        var player1 = _context.Users.FirstOrDefault(u => u.GUID == game!.Player1Guid);
        var player2 = _context.Users.FirstOrDefault(u => u.GUID == game!.Player2Guid);
        
        return Ok(new JsonArray{ player1!.UserName, player2!.UserName});
    }
    
    [HttpGet("GameStarted")]
    public IActionResult CheckForGameStart(string gameId)
    {
        var game = GameManager.PlayingGames.FirstOrDefault(g => g.GameId == gameId);
        if(game == null) return NotFound();
        return Ok(game.Player2Guid != null);
    }
    
    [HttpPost("queue")]
    public IActionResult QueueChessGame([FromBody] string game)
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var user = _context.Users.FirstOrDefault(u => u.GUID == userGuid);
        if(user == null) return BadRequest($"User: {userGuid} not found");
        if(!Enum.TryParse<AvailableGames>(game, out var gameEnum)) return BadRequest();
        if (!GameManager.Queue(user!, gameEnum, _context, out var newGame)) return BadRequest("already queued");
        if(newGame == null) return Ok("Queueing");
        return Ok(newGame.GameId);
    }
}