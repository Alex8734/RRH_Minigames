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
        var game = GameManager.PlayingGames.Find(g => g.GameId == data.GameId);
        if(game == null) return NotFound();
        game!.Moves.Add(new Move
        {
            Game = game,
            GameId = data.GameId,
            Id = game.Moves.Count,
            MoveString = data.Move
        });
        _context.SaveChanges();
        return Ok();
    }
    [HttpGet("LastMove/{gameId}")]
    public IActionResult GetLastMove( string gameId)
    {
        var game = GameManager.PlayingGames.FirstOrDefault(g => g.GameId == gameId);
        if(game == null) return NotFound();
        if(game.Moves.Count == 0) return Ok(new JsonOutput<string>(""));
        return Ok(new JsonOutput<string>( game.Moves[^1].MoveString));
    }
    
    [HttpGet("Players/{gameId}")]
    public IActionResult GetPlayers(string gameId)
    {
        var game = GameManager.PlayingGames.FirstOrDefault(g => g.GameId == gameId);
        if(game == null) return NotFound(new JsonOutput<string>("game not found!"));
        var player1 = _context.Users.FirstOrDefault(u => u.GUID == game!.Player1Guid);
        var player2 = _context.Users.FirstOrDefault(u => u.GUID == game!.Player2Guid);
        
        return Ok(new JsonOutput<string[]>(new[]{ player1!.UserName, player2!.UserName}));
    }
    
    [HttpPost("EndGame/{gameId}")]
    public IActionResult StopGame(string gameId, [FromBody] string winner)
    {
        var game = GameManager.PlayingGames.FirstOrDefault(g => g.GameId == gameId);
        if(game == null) return NotFound(new JsonOutput<string>("game not found!"));
        game.WinnerGuid = _context.Users.FirstOrDefault(u => u.UserName == winner)?.GUID ?? "";
        if (!GameManager.EndGame(game, _context)) return NotFound(new JsonOutput<string>($"winner {game.WinnerGuid} not found!"));
        return Ok();
    }
    
    [HttpGet("GameStarted")]
    public IActionResult CheckForGameStart()
    {
        var playerGuid = IdentityController.GetGuidFromToken(HttpContext);
        var queue = GameManager.QueueingPlayers.FirstOrDefault(p => p.User.GUID == playerGuid);
        var gameId = GameManager.GetGameId(playerGuid!);
        if(queue == null && gameId == "") return BadRequest(new JsonOutput<string>("player not queued!"));
        return Ok(new JsonOutput<string>( 
            queue == null 
                ? gameId
                : "Queueing"));
    }
    
    [HttpPost("StartSoloGame")]
    public IActionResult LogSoloStart([FromBody] AvailableGames game)
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var user = _context.Users.FirstOrDefault(u => u.GUID == userGuid);
        if(user == null) return BadRequest($"User: {userGuid} not found");
        var newgame = GameManager.StartSoloGame(user!, game, _context);
        return Ok(new JsonOutput<string>(newgame.GameId));
    }
    
    [HttpPost("EndSoloGame/{gameId}")]
    public IActionResult GetStats(string gameId, [FromBody] NewStat playerStat)
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        if (userGuid == null) return BadRequest(new JsonOutput<string>("user not found!"));
        var game = GameManager.PlayingSoloGames.FirstOrDefault(g => g.GameId == gameId);
        if(game == null) return NotFound(new JsonOutput<string>("game not found!"));
        var output = GameStatController.UpdatePlayerStat(playerStat, userGuid!, _context);
        return Ok(output);
    }
    
    [HttpPost("Queue")]
    public IActionResult QueueGame([FromBody] AvailableGames game)
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var user = _context.Users.FirstOrDefault(u => u.GUID == userGuid);
        if(user == null) return BadRequest($"User: {userGuid} not found");
        if (!GameManager.Queue(user!, game, _context, out var newGame)) return BadRequest(new JsonOutput<string>("already queued"));
        foreach (var quers in GameManager.QueueingPlayers)
        {
            Console.WriteLine(quers.User.UserName);
        }

        Console.WriteLine("");
        foreach (var playingGame in GameManager.PlayingGames)
        {
            Console.WriteLine($"{playingGame.Player1Guid} vs {playingGame.Player2Guid} : {playingGame.GameName}");
        }
        if(newGame == null) return Ok(new JsonOutput<string>("Queueing"));
        return Ok(new JsonOutput<string>(newGame.GameId));
    }
    
    [HttpPost("Dequeue")]
    public IActionResult DequeueGame([FromBody] AvailableGames game)
    {
        var userGuid = IdentityController.GetGuidFromToken(HttpContext);
        var user = _context.Users.FirstOrDefault(u => u.GUID == userGuid);
        if(user == null) return BadRequest(new JsonOutput<string>($"User: {userGuid} not found"));
        if (!GameManager.Dequeue(user!, game)) return BadRequest(new JsonOutput<string>("nobody queued"));
        foreach (var quers in GameManager.QueueingPlayers)
        {
            Console.WriteLine(quers.User);
            
        }
        if(GameManager.QueueingPlayers.Count == 0)
        {
            Console.WriteLine("no querers");
        }
        return Ok(new JsonOutput<QueueingMember[]>(GameManager.QueueingPlayers.ToArray()));
    }
}